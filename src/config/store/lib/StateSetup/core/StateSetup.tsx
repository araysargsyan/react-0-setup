import {
    type FC,
    type PropsWithChildren,
    type ComponentType,
    Suspense,
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';
import {
    createAsyncThunk,
    createSelector,
    createAction,
    createReducer,
    type ActionCreatorWithPayload,
    type Reducer,
    type ThunkDispatch,
    type AnyAction,
} from '@reduxjs/toolkit';
import {
    Navigate,
    useLocation,
    useNavigate,
    useSearchParams
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    type TStateSetupFn,
    type IAppSchema,
    type IAuthProtection,
    type IOptionsParameter,
    type IPageOptions,
    type TGetStateSetupConfig,
    type TStateSetUpArgs,
    type TCheckAuthorizationFn,
    type TCheckAuthorizationAsyncThunk,
    type IThunkConfig,
    type IStateSchema,
    type TSetIsAuthenticated,
    type TDispatch,
    type TInitAuth,
    type TCheckAuthorizationReturn,
    type TAsyncReducer,
    type TAsyncReducersOptions,
    type TCb,
    type TMode,
    type TStateSetup,
    type TUseRedirectionContext,
    type TypeFromConstValues
} from '../types';
import FlowStateChecker from './FlowStateChecker';


const LoadingTypes = {
    Loading: 'LOADING',
    Suspense: 'SUSPENSE',
} as const;
const FlowStatuses = {
    Start: 'START',
    Setup: 'SETUP',
    SetupFirst: 'SETUP_FIRST'
} as const;
const RestartTypes = {
    OnAuth: 'ON_AUTH',
    AuthExpired: 'AUTH_EXPIRED',
} as const;
const RedirectionTypes = {
    ...RestartTypes,
    FirstRender: 'FIRST_RENDER',
    NotFirstRender: 'NOT_FIRST_RENDER'
} as const;
type TLoading = TypeFromConstValues<typeof LoadingTypes>;
type TFlowStatuses = TypeFromConstValues<typeof FlowStatuses>;
type TRestartTypes = TypeFromConstValues<typeof RestartTypes>;
type TRedirectionTypes = TypeFromConstValues<typeof RedirectionTypes>;


export const flowState = new FlowStateChecker();
// @ts-ignore
window.flowState = flowState;

class StateSetup {
    public static readonly authProtectionConfig: IAuthProtection = {} as IAuthProtection;
    public static set $authProtectionConfig({ authorized, unAuthorized }: {authorized?: string; unAuthorized?: string}) {
        if (authorized) {
            this.authProtectionConfig.authorized = authorized;
        }
        if (unAuthorized) {
            this.authProtectionConfig.unAuthorized = unAuthorized;
        }
    }
    private readonly basePageOptions: IPageOptions & {isPageLoaded: boolean; isActionsCalling: boolean; pageNumber?: number} = {
        actions: [],
        authRequirement: null,
        isPageLoaded: false,
        isActionsCalling: false
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;
    private readonly PageLoader: ComponentType | null;

    private _prevRoute?: {
        pathname: string;
        mustDestroy?: boolean;
        ready?: boolean;
    };
    private isAuth: boolean | null = null;
    private redirectTo: string | null = null;
    private hasRedirectionModal: boolean = false;
    private loading: TLoading | null = null;
    private loadingCount: number | null = null;
    private waitUntil = false; //* for not lazy loaded components
    private restart: TRestartTypes | null = null;
    private flowStatus: TFlowStatuses | null = null;
    private currentRoute: string | null = null;
    private pageOptionsMap: Record<string, IPageOptions & {
        isPageLoaded: boolean; isActionsCalling: boolean; _break?: Record<number, boolean>; pageNumber?: number;
    }> = {};
    private asyncReducer: TAsyncReducer | null = null;
    private redirectionContext: ReturnType<TUseRedirectionContext<TRedirectionTypes>>['context'] = null;
    private pageNumber = 0;
    private isAuthChecking = false;

    private get prevRoute(): typeof this._prevRoute {
        return this._prevRoute;
    }
    private set prevRoute(value: Exclude<typeof this._prevRoute, undefined>) {
        if (value.pathname) {
            this._prevRoute = value;
        } else {
            this._prevRoute = {
                ...this.prevRoute,
                ...value
            };
        }

    }

    private get $AppState() {
        return {
            isAuth: this.isAuth,
            isAuthChecking: this.isAuthChecking,
            flowStatus: this.flowStatus,
            currentRoute: this.currentRoute,
            redirectTo: this.redirectTo,
            loading: this.loading,
            loadingCount: this.loadingCount,
            waitUntil: this.waitUntil,
            restart: this.restart,
            prevRoute: JSON.parse(JSON.stringify(this.prevRoute || {})),
            pageOptionsMap: JSON.parse(JSON.stringify(this.pageOptionsMap)),
            redirectionContext: JSON.parse(JSON.stringify(this.redirectionContext)),
            asyncReducer: this.asyncReducer,
            pageNumber: this.pageNumber
        };
    };

    private reducer!: Reducer;
    private setIsAuthenticated!: TSetIsAuthenticated;
    private setIsAppReady!: ActionCreatorWithPayload<boolean>;
    private setLoading!: ActionCreatorWithPayload<boolean>;
    private setIsPageReady!: ActionCreatorWithPayload<boolean>;
    private setRedirectionModal!: ActionCreatorWithPayload<boolean>;

    constructor(
        getStateSetupConfig: TStateSetupFn,
        checkAuthorization: TCheckAuthorizationFn,
        {
            appReducerName,
            authProtectionConfig = {
                unAuthorized: './login',
                authorized: './'
            },
            PageLoader
        }: IOptionsParameter
    ) {
        console.log('StateSetup::__constructor__', { getStateSetupConfig, options: { appReducerName, authProtectionConfig } });
        this.getStateSetupConfig = getStateSetupConfig as TGetStateSetupConfig;
        StateSetup.$authProtectionConfig = {
            ...authProtectionConfig,
            ...JSON.parse(localStorage.getItem('$authProtectionConfig') || '{}') as IAuthProtection,
        };
        this.PageLoader = PageLoader || null;
        this.checkAuthorization = createAsyncThunk<
            TCheckAuthorizationReturn,
            Parameters<TCheckAuthorizationAsyncThunk>[0],
            IThunkConfig
        >(
            '@@INIT:Authorization',
            async (args, thunkAPI) => {
                console.log('%c@@INIT:Authorization', 'color: #076eab');
                return this.initAuth({ ...args, checkAuthorization }, thunkAPI);
            }
        );
        this.generateActions(appReducerName);
        this.generateReducer();
    }

    private setBreakPageActions(pathname: string, pageNumber: number) {
        flowState.calls['BREAK'] = flowState.calls['BREAK'] + 1;
        console.log('setBreakPageActions', pathname, pageNumber);
        this.redirectTo = null;
        if (this.pageOptionsMap[pathname]._break) {
            this.pageOptionsMap[pathname]._break![pageNumber] = true;
        } else {
            this.pageOptionsMap[pathname]._break = { [pageNumber]: true };
        }
    }

    private initAuth: TInitAuth = async (
        {
            checkAuthorization,
            pathname,
            searchParams,
            mode,
        },
        thunkAPI
    ) => {
        flowState.calls['CHECK_AUTH'] = flowState.calls['CHECK_AUTH'] + 1;
        this.isAuthChecking = true;
        const pageNumber = this.pageNumber;
        const prevInitiated = this.flowStatus;

        try {
            const prevRedirectTo = this.getRedirectTo(this.flowStatus === FlowStatuses.Start
                ? this.currentRoute! : pathname
            );
            const isAuth = await checkAuthorization({ isAuth: this.isAuth }, thunkAPI);
            const isAuthExpired = typeof isAuth === 'boolean' && this.isAuth && isAuth !== this.isAuth;

            if (typeof isAuth === 'boolean') {
                this.isAuth = isAuth;
                thunkAPI.dispatch(this.setIsAuthenticated(isAuth));
            } else {
                throw new Error('checkAuthorization');
            }

            const redirectTo = this.getRedirectTo(this.currentRoute!);
            if (redirectTo) {
                this.updateBasePageOptions(redirectTo, searchParams);

                if (isAuthExpired) {
                    console.log('%cAuthorization', 'color: #076eab', 'AUTH_EXPIRED');
                    this.restart = RestartTypes.AuthExpired;
                }
            }

            const { waitUntil } = this.getPageOption(redirectTo || this.currentRoute!, 'onNavigate') || {};
            console.log('%cAuthorization', 'color: #076eab', 'AFTER_CHECK_AUTH', {
                redirectTo,
                prevRedirectTo,
                // mustRedirectTo,
                pathname,
                isAuthExpired,
                isAuth,
                waitUntil,
                prevInitiated,
                pageNumber,
                $AppState: this.$AppState
            });

            return thunkAPI.fulfillWithValue({
                redirectTo,
                mode,
                waitUntil: waitUntil || null,
            });
        } catch (e) {
            console.log(e);
            return thunkAPI.rejectWithValue('error');
        } finally {
            this.isAuthChecking = false;
            console.log('%cAuthorization: finally', 'color: #076eab', {
                $AppState: this.$AppState,
                pathname,
                prevInitiated,
                pageNumber,
            });
            // if (this.currentRoute !== pathname) {
            //     console.log('%cAuthorization', 'color: #076eab', 'SET_BREAK');
            //     this.setBreakPageActions(pathname, pageNumber);
            // } else if (prevInitiated === FlowStatuses.SetupFirst /*&& isAuthFirst*/) {
            //     // this.flowStatus = null;
            // }
        }
    };
    private generateActions(appReducerName: string) {
        this.setIsAuthenticated = createAction(
            `${appReducerName}/setIsAuthenticated`,
            (isAuthenticated: boolean, restart: boolean = false) =>({
                payload: {
                    isAuthenticated,
                    restart
                },

            })
        );
        this.setIsAppReady = createAction(
            `${appReducerName}/setIsAppReady`,
            (payload: boolean) => ({ payload })
        );
        this.setLoading = createAction(
            `${appReducerName}/setLoading`,
            (payload: boolean) => ({ payload })
        );
        this.setIsPageReady = createAction(
            `${appReducerName}/setIsPageReady`,
            (payload: boolean) => ({ payload })
        );
        this.setRedirectionModal = createAction(
            `${appReducerName}/setRedirectionModal`,
            (payload: boolean) => ({ payload })
        );
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isAppReady: false,
            isPageReady: false,
            isAuthenticated: false,
            // loadingCount: 0,
            loading: false,
            isRedirectionModalActive: false,
        }, (builder) => {
            builder
                .addCase(this.checkAuthorization.fulfilled, (
                    state,
                    { payload: { redirectTo, mode } }
                ) => {
                    if (mode === 'APP') {
                        // if (this.restart === RestartTypes.AuthExpired) {
                        //     state.isPageReady = false;
                        //     this.redirectTo = redirectTo;
                        // } else {
                        if (this.waitUntil) {
                            this.waitUntil = false;
                            this.loading = null;
                            state.loading = false;
                            // state.loadingCount = state.loadingCount + 0.5;
                            this.loadingCount = (this.loadingCount || 0) + 0.5;
                        }
                        this.redirectTo = redirectTo;
                        state.isAppReady = true;
                        state.isPageReady = true;
                        // }
                    } /*else {
                        if (redirectTo === null) {
                            if (waitUntil === 'CHECK_AUTH') {
                            } else if (waitUntil === 'SETUP') {
                                this.flowStatus = false;
                            } else {
                            }
                        } else {
                            this.flowStatus = false;
                        }
                    }*/
                })
                .addCase(this.setup.fulfilled, (state, { payload }) => {
                    if (payload?.mode === 'APP') {
                        // this.redirectTo = null
                        state.isAppReady = Boolean(payload.isAppReady);
                        state.isPageReady = Boolean(payload.isAppReady);
                    } /*else {
                        state.isPageReady = Boolean(isAppReady);
                    }*/
                })
                .addCase(this.setIsAuthenticated, (
                    state,
                    { payload }
                ) => {
                    state.isAuthenticated = payload.isAuthenticated;
                    this.isAuth = state.isAuthenticated;

                    if (payload.restart) {
                        const redirectTo = this.getRedirectTo(this.prevRoute!.pathname);
                        if (redirectTo) {
                            this.restart = RestartTypes.OnAuth;
                            state.isPageReady = false;
                        }

                        console.log('RESTART::this.setIsAuthenticated', {
                            redirectTo,
                            payload,
                            $AppState: this.$AppState
                        });
                    }
                })
                .addCase(this.setIsAppReady, (state, { payload }) => {
                    state.isAppReady = payload;
                })
                .addCase(this.setLoading, (state, { payload }) => {
                    console.log('..........this.setLoading', payload);
                    // flowState.calls.LOADING = state.loadingCount + 0.5;
                    flowState.calls.LOADING = (this.loadingCount || 0) + 0.5;
                    state.loading = payload;
                    this.loadingCount = (this.loadingCount || 0) + 0.5;
                })
                .addCase(this.setIsPageReady, (state, { payload }) => {
                    state.isPageReady = payload;
                })
                .addCase(this.setRedirectionModal, (state, { payload }) => {
                    state.isRedirectionModalActive = payload;
                });
        });
    }
    private updateBasePageOptions(path: string, searchParams: URLSearchParams) {
        if (!this.pageOptionsMap[path]) {
            this.pageOptionsMap[path] = {
                ...this.basePageOptions,
                ...this.getStateSetupConfig(searchParams)[path]
            };
        }
    };

    private getPageOption<K extends keyof IPageOptions>(pathname: string, key: K): IPageOptions[K] {
        return this.pageOptionsMap[pathname][key];
    }

    private async callReducerManager(
        method: 'add' | 'remove',
        asyncReducerOptions: IPageOptions['asyncReducerOptions'],
        state: IStateSchema,
        dispatch: TDispatch
    ) {
        console.log('************callReducerManager', { state, method });
        let asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1] = null;
        const call = async (options: unknown[])=> {
            if (method === 'add') {
                await this.asyncReducer!.add(dispatch, options);
            } else {
                await this.asyncReducer!.remove(dispatch, options);
            }
        };

        if (asyncReducerOptions) {
            if (typeof asyncReducerOptions === 'function') {
                const [ options, actionCreators ] = await asyncReducerOptions(state);

                if (method === 'add') {
                    asyncActionCreatorsOption = actionCreators;
                }
                await call(options);
            } else {
                await call(asyncReducerOptions);
            }
        }

        return asyncActionCreatorsOption;
    }
    private async callActions(
        pathname: string,
        dispatch: TDispatch,
        state: IStateSchema,
        asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1]
    ) {
        let isLoopBroken = false;
        const actions = this.getPageOption(pathname, 'actions');
        console.log(`*************************START_callActions{${pathname}}`, { actions });

        for (let i = 0; i < actions.length; i++) {
            const pageNumber = this.pageOptionsMap[pathname].pageNumber!;

            console.log(`*************************callAction{${pathname}}`, {
                $AppState: this.$AppState, pathname, mustBreak: this.currentRoute !== pathname, pageNumber
            });
            if (this.pageOptionsMap[pathname]._break?.[pageNumber]) {
                delete this.pageOptionsMap[pathname]._break?.[pageNumber];
                delete this.pageOptionsMap[pathname].pageNumber;
                if (this.currentRoute !== pathname) {
                    this.pageOptionsMap[pathname].isActionsCalling = false;
                    isLoopBroken = true;
                    console.log('*************************BREAK', pathname);
                    break;
                }
            }

            const action = actions[i];
            const isAsync = action.async;

            if (typeof action.canRefetch === 'function') {
                action._fetched = !action.canRefetch(state);
            } else if (!action.canRefetch) {
                action.canRefetch = false;
            }

            if (!action._fetched) {
                if (asyncActionCreatorsOption
                    && typeof action.cb === 'object'
                    && asyncActionCreatorsOption[action.cb.key]
                ) {
                    const cb = action.cb.getAction(asyncActionCreatorsOption[action.cb.key]);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`*************************ACTION: {${cb?.typePrefix || cb?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch(cb());
                    } else {
                        dispatch(cb());
                    }
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`*************************ACTION: {${action.cb?.typePrefix || action.cb?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch((action.cb as TCb)());
                    } else {
                        dispatch((action.cb as TCb)());
                    }
                }
            }

            if (!action.canRefetch) {
                action._fetched = true;
            }
        }

        return isLoopBroken;
    }

    private getRedirectTo(pathname: string) {
        const authRequirement = this.getPageOption(pathname, 'authRequirement');

        let redirectTo = null;

        if (authRequirement !== null) {
            redirectTo = authRequirement
                ? (!this.isAuth
                        ? StateSetup.authProtectionConfig.unAuthorized
                        : null)
                : (this.isAuth
                        ? StateSetup.authProtectionConfig.authorized
                        : null);
        }

        return redirectTo !== pathname ? redirectTo : null;
    };

    private isPageLoaded = (pathname: string) => Boolean(this.pageOptionsMap[pathname]?.isPageLoaded);
    private isElementLazyLoaded(Element: any) {
        let element = Element;

        while (Boolean(element.type)) {
            element = element.type;
        }

        return element.$$typeof === Symbol.for('react.lazy');
    }

    private setup = createAsyncThunk<
        { isAppReady: boolean | null; mode: TMode } | void,
        TStateSetUpArgs,
        IThunkConfig
    >(
        '@@INIT:STATE',
        async (
            {
                pathname,
                pageNumber,
                mode,
                asyncReducer,
                type
            },
            {
                rejectWithValue,
                fulfillWithValue,
                getState,
                dispatch
            }
        ) => {
            flowState.calls[type].count = flowState.calls[type].count + 1;
            console.log(`%c@@INIT:STATE{${pathname}}`, 'color: #ed149a', { $AppState: this.$AppState });
            try {
                this.pageOptionsMap[pathname].pageNumber = pageNumber;
                const prevInitiated = this.flowStatus;
                let asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1] = null;
                this.flowStatus = type;
                this.pageOptionsMap[pathname].isActionsCalling = true;

                console.log('%csetUp::start', 'color: #ed149a', {
                    pathname,
                    isAppReady: getState().app.isAppReady,
                    mode,
                    state: getState(),
                    asyncReducer,
                    $AppState: this.$AppState,
                    prevInitiated,
                    type
                });

                if (asyncReducer && this.asyncReducer === null) {
                    this.asyncReducer = asyncReducer;
                }
                if (this.asyncReducer) {
                    const asyncReducerOptions = this.getPageOption(pathname, 'asyncReducerOptions');

                    if (this.prevRoute?.pathname !== pathname) {
                        if (this.prevRoute?.mustDestroy) {
                            const asyncReducerOptions = this.getPageOption(this.prevRoute.pathname, 'asyncReducerOptions');
                            await this.callReducerManager('remove', asyncReducerOptions, getState(), dispatch);
                        }

                        asyncActionCreatorsOption = await this.callReducerManager('add', asyncReducerOptions, getState(), dispatch);
                    }

                    if (asyncReducerOptions && !asyncActionCreatorsOption) {
                        asyncActionCreatorsOption = (await asyncReducerOptions(getState()))[1];
                    }
                }

                const isBroken = await this.callActions(pathname, dispatch, getState(), asyncActionCreatorsOption);
                if (isBroken) {
                    flowState.calls[type].breakCount = flowState.calls[type].breakCount + 1;
                }

                console.info('%csetUp::end', 'color: #ed149a', {
                    pathname, isAppReady:
                    getState().app.isAppReady,
                    mode,
                    state: getState(),
                    $AppState: this.$AppState,
                    prevInitiated,
                    type
                });

                if (
                    !isBroken
                    && this.currentRoute === pathname
                    && this.pageOptionsMap[this.currentRoute].isActionsCalling/*&& this.flowStatus === type*/
                ) {
                    console.log('%csetUp->PAGE_IS_READY', 'color: #ed149a', flowState.get());

                    if (this.loading === null && this.loadingCount !== null && Math.round(this.loadingCount) === this.loadingCount) {
                        if (!flowState['useEffect: Update'].____RedirectModal_____.MODAL) {
                            flowState.reset();
                        }
                        this.loadingCount = 0;
                    }
                    this.prevRoute = {
                        pathname,
                        ready: true,
                    };
                    this.flowStatus = null;
                    this.pageOptionsMap[pathname].isActionsCalling = false;
                    return fulfillWithValue({ isAppReady: true, mode });
                }
                // if (
                //     !mustClearInitiated
                //     && !this.isAuthChecking
                //     && isBroken
                //     && this.currentRoute !== pathname
                //     && !this.pageOptionsMap[this.currentRoute].isActionsCalling
                // ) {
                //     const { waitUntil } = this.getPageOption(this.currentRoute, 'onNavigate') || {};
                //
                //     if (waitUntil) {
                //         console.log('%csetUp->RECALL', 'color: #ed149a', this.currentRoute);
                //         dispatch(this.setup({
                //             type: 'SETUP',
                //             pathname: this.currentRoute,
                //             mode: 'APP'
                //         }));
                //     }
                // }
            } catch (err) {
                console.error('setUp::catch', err);
                return rejectWithValue('Something went wrong!');
            } finally {
                this.pageOptionsMap[pathname].isActionsCalling = false;
                if (this.redirectTo) {
                    this.redirectTo = null;
                }

                // if (mustClearInitiated) {
                //     console.log('%csetUp->ClearInitiated', 'color: #ed149a');
                //     this.flowStatus = null;
                // }

                console.log('%csetUp::finally', 'color: #ed149a', {
                    state: getState().app, $AppState: this.$AppState, flowState: flowState.get()
                });
            }
        }
    );

    private useContext = () => {
        const show = useSelector(({ app }: IStateSchema) => app.isRedirectionModalActive);
        const dispatch = useDispatch();

        return {
            closeRedirectionModal: () => {
                if (this.redirectionContext) {
                    this.redirectionContext = null;
                    dispatch(this.setRedirectionModal(false));
                }
            },
            context: this.redirectionContext,
            show
        };
    };

    private usePageStateSetup = (
        asyncReducer?: TAsyncReducer
    ) => {
        const dispatch = useDispatch<ThunkDispatch<IStateSchema, unknown, AnyAction>>();
        const setup = useCallback(
            (...args: Parameters<TStateSetup>) => dispatch(this.setup(...args)),
            [ dispatch ]
        );
        const checkAuth = useCallback(
            (...args: Parameters<TCheckAuthorizationAsyncThunk>) => dispatch(this.checkAuthorization(...args)),
            [ dispatch ]
        );
        const { pathname, state } = useLocation();
        const [ searchParams ] = useSearchParams();
        const navigate = useNavigate();
        // const prevRoute = this.currentRoute || pathname;
        const isLoadingActivated = useRef(false);
        let stopActionsRecall = false;
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: START', {
            $AppState: this.$AppState,
            pathname
        });

        this.pageNumber = this.pageNumber + 1;
        if (this.currentRoute !== pathname) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_CURRENT_ROUTE');
            if (this.currentRoute) {
                this.prevRoute = { pathname: this.currentRoute };
            }
            this.currentRoute = pathname;
        }
        if (this.prevRoute && this.prevRoute.pathname !== pathname) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'mustDestroy', this.prevRoute);
            this.prevRoute.mustDestroy = true;
        }
        if (!this.pageOptionsMap[pathname]) {
            this.updateBasePageOptions(pathname, searchParams);
        }

        const currentPageCount = this.pageNumber;
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const redirectTo = this.getRedirectTo(pathname);
        const mustRedirectTo = this.isAuth !== null && redirectTo;
        const mustActivateLoading = this.loading !== LoadingTypes.Loading
            && waitUntil
            && !this.pageOptionsMap[mustRedirectTo || pathname]?.isPageLoaded
            && (!state?.from || this.restart === RestartTypes.AuthExpired)
            && this.prevRoute?.pathname !== redirectTo;

        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: END', {
            $AppState: this.$AppState,
            pathname,
            // prevRoute,
            waitUntil,
            stateFrom: state?.from
        });

        if (
            (this.flowStatus === FlowStatuses.Setup || this.flowStatus === FlowStatuses.SetupFirst)
            // && (!this.isAuthChecking || waitUntil)
            // && (!waitUntil || this.isAuth === false)
            && this.prevRoute
            && !state?.from
        ) {
            if (this.prevRoute.pathname !== this.currentRoute) {
                if (this.pageOptionsMap[this.prevRoute!.pathname].isActionsCalling) {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_BREAK');
                    this.setBreakPageActions(this.prevRoute!.pathname, this.pageOptionsMap[this.prevRoute!.pathname].pageNumber!);
                }
            } else {
                this.pageOptionsMap[this.currentRoute].pageNumber = this.pageNumber;
                stopActionsRecall = true;
            }
        }

        if (mustActivateLoading) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'PRE-SET_LOADING');
            isLoadingActivated.current = false;
            this.loading = LoadingTypes.Loading;
        }
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '::START', {
            pathname,
            waitUntil,
            redirectTo,
            mustRedirectTo,
            mustActivateLoading,
            isLoadingActivated: isLoadingActivated.current,
            stateFrom: state?.from,
            'this.$AppState': this.$AppState,
        });

        useLayoutEffect(() => {
            if (!flowState.navigate) {
                flowState.navigate = navigate;
            }
            if (mustRedirectTo) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'REDIRECT');
                if (!this.pageOptionsMap[redirectTo]) {
                    this.updateBasePageOptions(redirectTo, searchParams);
                }

                navigate(redirectTo, { state: { from: pathname } });
            }
            if (!isLoadingActivated.current
                && this.loading === LoadingTypes.Loading
                // this.flowStatus === FlowStatuses.Start
                // && this.loading === LoadingTypes.Loading
                // && !isLoadingActivated.current
            ) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'SET_LOADING');
                isLoadingActivated.current = true;
                dispatch(this.setLoading(true));
            }
        });

        useEffect(() => {
            const mustCheckAuth = !this.isAuthChecking
                && this.flowStatus === FlowStatuses.Start
                && (this.isAuth === null || Boolean(this.isAuth));
            const mustCallActions = (!waitUntil || this.isAuth === false)
                && !this.pageOptionsMap[pathname].isActionsCalling
                && !stopActionsRecall
                && !this.redirectTo
                && (!state?.from || (this.restart && this.restart !== RestartTypes.AuthExpired));
            const mustShowRedirectionModal = (this.flowStatus === FlowStatuses.Start || this.isAuth === false)
                && this.hasRedirectionModal
                && !this.redirectionContext
                && state?.from
                && !mustCheckAuth;
            flowState['useEffect: Update'].____usePageStateSetUp____ = flowState['useEffect: Update'].____usePageStateSetUp____ + 1;
            console.log('%c____usePageStateSetUp____: UPDATE', 'color: #ae54bf', {
                stateFrom: state?.from,
                pathname,
                waitUntil,
                mustCheckAuth,
                mustCallActions,
                stopActionsRecall,
                mustShowRedirectionModal,
                $AppState: this.$AppState
            }, 'PagesCount=' + this.pageNumber);

            if (mustShowRedirectionModal) {
                this.redirectionContext = {
                    redirectTo: pathname,
                    from: state.from,
                    type: RedirectionTypes.NotFirstRender,
                    isPageLoaded: this.isPageLoaded(pathname)
                };
                if (this.isAuth === false) {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                    dispatch(this.setRedirectionModal(true));
                }
            }

            if (mustCallActions) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                    '============SetUp=============', this.currentRoute
                );
                setup({
                    mode: 'APP',
                    pathname: mustRedirectTo || this.currentRoute!,
                    pageNumber: currentPageCount,
                    type: FlowStatuses.SetupFirst,
                    asyncReducer
                });
            }

            if (mustCheckAuth) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                    '============CheckAuth=============', { $AppState: this.$AppState }
                );
                checkAuth({
                    pathname,
                    searchParams,
                    mode: 'APP'
                }).then((result) => {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                        '============CheckAuth=============: AFTER', {
                            $AppState: this.$AppState,
                            result,
                            pathname,
                        }
                    );
                    if (this.checkAuthorization.fulfilled.match(result)) {
                        // if (!this.pageOptionsMap[this.currentRoute]._break?.[currentPageCount]) {
                        if (!this.pageOptionsMap[this.currentRoute!].isActionsCalling && (
                            result.payload.redirectTo
                                ? (!mustRedirectTo || this.restart === RestartTypes.AuthExpired)
                                : result.payload.waitUntil
                        )
                        ) {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============SetUp>>>CheckAuth=============', {
                                result,
                                pathname,
                                $AppState: this.$AppState
                            });
                            setup({
                                pageNumber: result.payload.redirectTo ? this.pageNumber + 1 : this.pageNumber,
                                pathname: result.payload.redirectTo || this.currentRoute!,
                                type: FlowStatuses.Setup,
                                mode: 'APP',
                                asyncReducer
                            });
                        }
                        // } else {
                        //     delete this.pageOptionsMap[this.currentRoute]._break?.[currentPageCount];
                        // }

                        if (result.payload.redirectTo && (!mustRedirectTo || this.restart === RestartTypes.AuthExpired)) {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'REDIRECT');
                            this.redirectionContext = {
                                redirectTo: result.payload.redirectTo,
                                from: this.currentRoute!,
                                type: this.restart || RedirectionTypes.FirstRender,
                                isPageLoaded: this.isPageLoaded(result.payload.redirectTo)
                            };
                            this.hasRedirectionModal && dispatch(this.setRedirectionModal(true));
                            navigate(result.payload.redirectTo, { state: { from: this.currentRoute } });
                        } else if (this.hasRedirectionModal && this.redirectionContext?.type === RedirectionTypes.NotFirstRender) {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                            dispatch(this.setRedirectionModal(true));
                        }
                    }
                });
            }

            if (this.restart) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'CLEAN>RESTART');
                this.restart = null;
            }

            if (state?.from) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'CLEAN_STATE>FROM');
                delete state.from;
                window.history.replaceState(state, document.title);
            }
        });
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '::END', {
            redirectTo,
            waitUntil,
            pathname,
            from: state?.from,
            'this.$AppState': this.$AppState,
        });

        return pathname;
    };

    public createRedirectionModal = (modal: FC<{ useContext: TUseRedirectionContext<TRedirectionTypes> }>) => {
        return memo(modal);
    };

    public StateSetupProvider: FC<PropsWithChildren<{
        asyncReducer?: TAsyncReducer;
        RedirectionModal?: FC<{ useContext: TUseRedirectionContext<TRedirectionTypes> }>;
    }>> = ({
            children,
            asyncReducer,
            RedirectionModal
        }) => {
            if (this.flowStatus === null) {
                this.flowStatus = FlowStatuses.Start;
            }

            const pathname = this.usePageStateSetup(asyncReducer);

            useEffect(() => {
                console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
                    pathname, asyncReducer, $AppState: this.$AppState
                });
            });
            useEffect(() => {
                this.hasRedirectionModal = Boolean(RedirectionModal);
            }, [ RedirectionModal ]);

            return (
                <>
                    { RedirectionModal ? (
                        <RedirectionModal
                            useContext={ this.useContext }
                        />
                    ) : null }
                    { children }
                </>
            );
        };

    private getLoading = (
        type: TLoading,
        waitUntil?: Exclude<IPageOptions['onNavigate'], undefined>['waitUntil']
    ) => createSelector(
        // ({ app }: IStateSchema) => app.loadingCount,
        ({ app }: IStateSchema) => app.loading,
        (loading) => {
            let willLoading = false;

            if (!this.isPageLoaded(this.currentRoute!) || this.restart === RestartTypes.OnAuth) {
                if (
                    !waitUntil
                    && type === LoadingTypes.Suspense
                    && this.loading !== LoadingTypes.Loading
                ) {
                    willLoading = true;
                } else if (type === LoadingTypes.Loading && this.loading === LoadingTypes.Loading) {
                    willLoading = true;
                }
            }

            console.log(`%c$$$getLoading$$$-${this.currentRoute}`, 'color: #dbd518', {
                type,
                waitUntil,
                loading,
                willLoading,
                $AppState: this.$AppState
            });
            return willLoading;
        }
    );

    // eslint-disable-next-line react/display-name
    private Loader = memo<{
        type?: TLoading;
        pathname: string;
        PageLoader?: ComponentType;
    }>(({
        type = LoadingTypes.Loading, pathname, PageLoader
    }) => {
        const dispatch = useDispatch();
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const loading = useSelector(this.getLoading(type, waitUntil));

        useEffect(() => {
            flowState['useEffect: Update'].____LOADER_____[type] = flowState['useEffect: Update'].____LOADER_____[type] + 1;
            console.log(`%c____LOADER_____: UPDATE{${pathname}}`, 'color: #dbd518', {
                type,
                waitUntil,
                loading,
                pathname,
                $AppState: this.$AppState
            });

            if (!loading && this.loading === LoadingTypes.Loading && this.isPageLoaded(this.currentRoute!)) {
                this.loading = null;
                dispatch(this.setLoading(false));
            }
        });

        useLayoutEffect(() => {
            if (type === LoadingTypes.Suspense && loading && this.loading === null) {
                console.log(`%c____LOADER_____{${pathname}}`, 'color: #dbd518', 'useLayoutEffect');
                this.loading = LoadingTypes.Suspense;
                dispatch(this.setLoading(true));
            }

            return () => {
                console.log(`%c____LOADER_____{${pathname}}`, 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', {
                    type,
                    loading,
                    pathname,
                    $AppState: this.$AppState
                });

                if (
                    type === LoadingTypes.Suspense
                        ? !this.isPageLoaded(pathname)
                            && (pathname === this.currentRoute
                                // || (this.isPageLoaded(this.currentRoute!) && !loading)
                                || (this.restart === RestartTypes.AuthExpired && this.isPageLoaded(this.currentRoute!))
                            )
                        : false
                        // (this.redirectTo && this.isPageLoaded(this.redirectTo) && this.loading && pathname !== this.currentRoute && !loading)
                ) {
                    console.log(`%c____LOADER_____{${pathname}}`, 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', '+++Clear+++');
                    if (pathname === this.currentRoute) {
                        this.pageOptionsMap[pathname].isPageLoaded = true;
                    }

                    this.loading = null;
                    dispatch(this.setLoading(false));
                    if (this.prevRoute?.ready && this.loadingCount && Math.round(this.loadingCount) === this.loadingCount) {
                        if (!flowState['useEffect: Update'].____RedirectModal_____.MODAL) {
                            flowState.reset();
                        }
                        this.loadingCount = 0;
                    }
                    console.log(`__________FIRST_RENDER____________{${pathname}}`, { $AppState: this.$AppState });
                }
            };
        }, [ loading, dispatch, type, pathname ]);

        console.log(`%c____LOADER-${type}_____{${pathname}}`, 'color: #dbd518', {
            $AppState: this.$AppState,
            loading,
        });

        return loading
            ? PageLoader
                ? <PageLoader />
                : this.PageLoader
                    ? <this.PageLoader />
                    : null
            : null;
    });

    private getIsPageReady = (pathname: string) => createSelector(
        ({ app }: IStateSchema) => app.isPageReady,
        (isPageReady) => {
            const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};

            console.log('%c$$$getIsPageReady$$$', 'color: #22af2c', {
                pathname,
                isPageReady,
                waitUntil,
                $AppState: this.$AppState
            });
            if (!waitUntil || (this.restart && this.prevRoute?.pathname !== pathname)) {
                return true;
            }

            return isPageReady && (pathname === this.redirectTo || this.redirectTo === null);
        }
    );

    public ProtectedElement: FC<PropsWithChildren<{ pathname: string; PageLoader?: ComponentType }>> = ({
        children,
        pathname,
        PageLoader
    }) => {
        const isPageReady = useSelector(this.getIsPageReady(pathname));
        const lazy = this.isElementLazyLoaded(children);
        const dispatch = useDispatch<TDispatch>();
        const [ searchParams ] = useSearchParams();

        console.log('%c____ProtectedElement_____', 'color: #22af2c', '::START', {
            lazy,
            pathname,
            isPageReady,
            'this.$AppState': this.$AppState,
        });

        const redirectTo = this.getRedirectTo(pathname);
        const { waitUntil } = this.getPageOption(this.redirectTo || pathname, 'onNavigate') || {};

        if (!lazy && this.loading === LoadingTypes.Loading) {
            this.waitUntil = true;
        }

        useEffect(() => {
            flowState['useEffect: Update'].____ProtectedElement_____ = flowState['useEffect: Update'].____ProtectedElement_____ + 1;
            console.log('%c____ProtectedElement_____: UPDATE', 'color: #22af2c', {
                pathname,
                isPageReady,
                'this.$AppState': this.$AppState,
            });
        });

        useLayoutEffect(() => {
            if (
                this.loading === LoadingTypes.Loading
                && this.restart === RestartTypes.OnAuth
                && redirectTo
                && !this.isPageLoaded(redirectTo)
            ) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'useLayoutEffect', 'SET-LOADING', { $AppState: this.$AppState, pathname });
                dispatch(this.setLoading(true));
            }
            if (this.hasRedirectionModal && this.restart && this.redirectionContext?.type === RedirectionTypes.OnAuth) {
                dispatch(this.setRedirectionModal(true));
            }
        }, [ isPageReady, dispatch, pathname, redirectTo ]);

        if (redirectTo && this.restart === RestartTypes.OnAuth) {
            console.log('%c____ProtectedElement_____', 'color: #22af2c', 'redirecting', { $AppState: this.$AppState });

            if (!this.pageOptionsMap[redirectTo]) {
                this.updateBasePageOptions(redirectTo, searchParams);
            }
            const { waitUntil } = this.getPageOption(redirectTo, 'onNavigate') || {};
            if (!this.loading && waitUntil && !this.isPageLoaded(redirectTo)) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'PRE_SET-LOADING');
                this.loading = LoadingTypes.Loading;
            }

            this.redirectionContext = {
                redirectTo,
                from: pathname,
                type: RedirectionTypes.OnAuth,
                isPageLoaded: this.isPageLoaded(redirectTo)
            };

            console.log('%c____ProtectedElement_____', 'color: #22af2c', '::END', {
                lazy,
                pathname,
                isPageReady,
                waitUntil,
                redirectTo,
                'this.$AppState': this.$AppState,
            });
            return (
                <>
                    { this.loading === LoadingTypes.Loading ? (
                        <this.Loader
                            pathname={ pathname }
                            PageLoader={ PageLoader }
                        />
                    ) : children }
                    <Navigate
                        to={ redirectTo }
                        state={{ from: pathname }}
                    />
                </>
            );
        }

        console.log('%c____ProtectedElement_____', 'color: #22af2c', '::END', {
            lazy,
            pathname,
            isPageReady,
            waitUntil,
            redirectTo,
            'this.$AppState': this.$AppState,
        });
        return (
            <>
                { this.loading === LoadingTypes.Loading ? (
                    <this.Loader
                        pathname={ pathname }
                        PageLoader={ PageLoader }
                    />
                ) : null }
                {
                    isPageReady && !redirectTo
                        ? (
                                !lazy && !waitUntil ?
                                    children : (
                                        <Suspense fallback={ (
                                            <this.Loader
                                                type={ LoadingTypes.Suspense }
                                                pathname={ pathname }
                                                PageLoader={ PageLoader }
                                            />
                                        ) }
                                        >
                                            { children }
                                        </Suspense>
                                    )
                            )
                        : null
                }
            </>
        );
    };

    public getStore() {
        return {
            reducer: this.reducer,
            actionCreators: {
                singIn: () => this.setIsAuthenticated(true, true),
                singOut: () => this.setIsAuthenticated(false, true)
            },
        };
    }
}

// @ts-ignore
window.StateSetup = StateSetup;
export default StateSetup;
