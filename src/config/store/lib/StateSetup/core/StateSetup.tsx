import {
    type FC,
    type PropsWithChildren,
    type ComponentType,
    Suspense,
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
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
    matchPath,
    useLocation,
    useNavigate,
    useSearchParams,
    type Params
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    type TStateSetupFn,
    type IAppSchema,
    type IAuthProtection,
    type IOptionsParameter,
    type IPageOptions,
    type IBasePageOptions,
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
    type TStateSetup,
    type TUseRedirectionContext,
    type IinitiatedState, type TPageOptionsArgument,
} from '../types';
import {
    LoadingTypes,
    FlowStatuses,
    RestartTypes,
    RedirectionTypes,
    type TRedirectionTypes,
    type TFlowStatuses,
    type TLoading,
    type TRestartTypes,
} from './const';
import FlowStateChecker from './FlowStateChecker';



const flowState = new FlowStateChecker();
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

    private readonly basePageOptions: IBasePageOptions & {_lazy?: true} = {
        actions: [],
        authRequirement: null,
        isPageLoaded: false,
        isActionsCalling: false,
        params: {},
    };
    private readonly initiatedStateDefault: IinitiatedState  = {
        stopActionsRecall: false,
        mustActivateLoading: false,
        currentPageCount: 0,
        mustRedirectTo: '',
        _initiated: false,
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly stateSetupConfigDynamicPaths: string[];
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;
    private readonly PageLoader: ComponentType | null;

    private _prevRoute?: {
        pathname: string;
        mustDestroy?: boolean;
        ready?: boolean;
    };
    private _initiatedState = {
        context: { ...JSON.parse(JSON.stringify(this.initiatedStateDefault)) } as IinitiatedState,
        reset: (breaking = false) => {
            if (breaking
                && this.loading === LoadingTypes.Loading
                && this._initiatedState.context.mustActivateLoading
            ) {
                this.loading = null;
            }
            this._initiatedState.context = { ...JSON.parse(JSON.stringify(this.initiatedStateDefault)) };
        },
        activate: () => {
            this._initiatedState.context._initiated = true;
        }
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
    private pageOptionsMap: Record<string, IBasePageOptions & {
        _lazy?: true;
        _break?: Record<number, boolean>;
        _notFound?: true;
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
            this._prevRoute = { ...value };
        } else {
            this._prevRoute = {
                ...this.prevRoute,
                ...value
            };
        }
    }

    private get initiatedState(): IinitiatedState {
        return this._initiatedState.context;
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
            initiatedState: JSON.parse(JSON.stringify(this.initiatedState)),
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
        StateSetupConfig: TStateSetupFn,
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
        console.log('StateSetup::__constructor__', { StateSetupConfig, options: { appReducerName, authProtectionConfig } });
        this.getStateSetupConfig = StateSetupConfig as TGetStateSetupConfig;
        this.stateSetupConfigDynamicPaths = Object.keys(this.getStateSetupConfig(new URLSearchParams()))
            .filter((path) => /:[^\/]+/.test(path));
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
            const isAuth = await checkAuthorization({ isAuth: this.isAuth }, thunkAPI as never as IThunkConfig);
            const isAuthExpired = this.isAuth && isAuth !== this.isAuth;

            this.isAuth = isAuth;
            thunkAPI.dispatch(this.setIsAuthenticated(isAuth));

            const redirectTo = this.getRedirectTo(this.currentRoute!);
            if (redirectTo) {
                this.updateBasePageOptions({
                    pathname: redirectTo,
                    searchParams
                });

                if (isAuthExpired) {
                    console.log('%cAuthorization', 'color: #076eab', 'AUTH_EXPIRED');
                    this.restart = RestartTypes.AuthExpired;
                }
            }

            const { waitUntil } = this.getPageOption(redirectTo || this.currentRoute!, 'onNavigate') || {};
            console.log('%cAuthorization', 'color: #076eab', 'AFTER_CHECK_AUTH', {
                redirectTo,
                prevRedirectTo,
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
                waitUntil: waitUntil || null,
                isAuthExpired
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
            loading: false,
            isRedirectionModalActive: false,
        }, (builder) => {
            builder
                .addCase(this.checkAuthorization.fulfilled, (
                    state,
                    { payload: { redirectTo } }
                ) => {
                    if (this.waitUntil) {
                        this.waitUntil = false;
                        this.loading = null;
                        state.loading = false;
                        this.loadingCount = (this.loadingCount || 0) + 0.5;
                    }
                    this.redirectTo = redirectTo;
                    state.isAppReady = true;
                })
                .addCase(this.setup.fulfilled, (state) => {
                    state.isPageReady = true;
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
                            state.isAppReady = false;
                        } else {
                            flowState.reset();
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
                .addCase(this.setIsPageReady, (state, { payload }) => {
                    state.isPageReady = payload;
                })
                .addCase(this.setLoading, (state, { payload }) => {
                    console.log('..........this.setLoading', payload);
                    flowState.calls.LOADING = (this.loadingCount || 0) + 0.5;

                    state.loading = payload;
                    this.loadingCount = (this.loadingCount || 0) + 0.5;
                })
                .addCase(this.setRedirectionModal, (state, { payload }) => {
                    state.isRedirectionModalActive = payload;
                });
        });
    }
    private updateBasePageOptions(
        {
            pathname, searchParams, params
        }: {
            pathname: string;
            searchParams: URLSearchParams;
            params?: Params<string>;
        },
        replace: string | false = false
    ) {
        if (!replace) {
            if (!this.pageOptionsMap[pathname]) {
                this.pageOptionsMap[pathname] = {
                    ...this.basePageOptions,
                    ...this.getStateSetupConfig(searchParams)[pathname]
                };
            }
            if (params) {
                this.pageOptionsMap[pathname].params = params;
            }
        } else {
            if (!this.pageOptionsMap[pathname]) {
                this.pageOptionsMap[pathname] = this.pageOptionsMap[replace];
                this.pageOptionsMap[replace]._notFound = true;
            } else if (this.pageOptionsMap[replace]) {
                this.pageOptionsMap[replace]._notFound = true;
            }
        }
    };

    private getPageOption<K extends keyof IPageOptions>(pathname: string, key: K): IPageOptions[K] {
        return this.pageOptionsMap[pathname]?.[key];
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
    private getPublicPageOptions(pageOptions: (typeof this.pageOptionsMap)[number]): Required<TPageOptionsArgument> {
        return {
            isActionsCalling: pageOptions.isActionsCalling,
            isPageLoaded: pageOptions._lazy ? pageOptions.isPageLoaded : true,
            pageNumber: this.pageNumber,
            params: pageOptions.params
        };
    }

    private isPageLoaded = (pathname: string) => Boolean(this.pageOptionsMap[pathname]?.isPageLoaded);

    private isActionsCalling = (pathname: string) => Boolean(this.pageOptionsMap[pathname]?.isActionsCalling);
    private async callReducerManager<T extends 'add' | 'remove'>(
        method: T,
        asyncReducerOptions: IPageOptions['asyncReducerOptions'],
        getState: () => IStateSchema,
        dispatch: TDispatch
    ) {
        console.log('************callReducerManager', {
            getState, method, asyncReducerOptions
        });
        let asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>['actionCreators'] = null;
        let callback: ReturnType<typeof call> | undefined;
        let moduleNames: string[] | undefined;
        const call = (options: any): ((moduleNames: Parameters<TAsyncReducer['remove']>[2]) => Promise<void>) => {
            if (method === 'add') {
                return ((moduleNames: Parameters<TAsyncReducer['remove']>[2]) => this.asyncReducer!
                    .add({ dispatch, getState }, options, moduleNames));
            } else {
                return ((moduleNames: Parameters<TAsyncReducer['remove']>[2]) => this.asyncReducer!
                    .remove({ dispatch, getState }, options, moduleNames));
            }
        };

        if (asyncReducerOptions) {
            const {
                moduleNames: MN, options, actionCreators
            } = await asyncReducerOptions(getState);
            moduleNames = MN;

            if (method === 'add') {
                asyncActionCreatorsOption = actionCreators;
                callback = call(options);
            } else {
                callback = call(options);
            }
        }

        return {
            asyncActionCreatorsOption, callback, moduleNames
        };
    }

    private isElementLazyLoaded(Element: any) {
        let element = Element;

        while (Boolean(element.type)) {
            element = element.type;
        }

        return element.$$typeof === Symbol.for('react.lazy');
    }

    private async callActions(
        pathname: string,
        dispatch: TDispatch,
        state: IStateSchema,
        asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>['actionCreators']
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
            const pageOptions = this.pageOptionsMap[pathname];

            if (typeof action.canRefetch === 'function') {
                action._fetched = !action.canRefetch(state);
            } else if (!action.canRefetch) {
                action.canRefetch = false;
            }

            if (!action._fetched) {
                if (asyncActionCreatorsOption
                    && typeof action.cb === 'object'
                    && asyncActionCreatorsOption[action.cb.moduleKey]
                ) {
                    const actionCreator = action.cb.getAction(
                        asyncActionCreatorsOption[action.cb.moduleKey],
                        this.getPublicPageOptions(pageOptions)
                    );
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`*************************ACTION: {${action.cb.getAction?.typePrefix || action.cb.getAction?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch(actionCreator());
                    } else {
                        dispatch(actionCreator());
                    }
                } else if (typeof action.cb === 'function') {
                    const actionCreator = action.cb(this.getPublicPageOptions(pageOptions));
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`*************************ACTION: {${action.cb?.typePrefix || action.cb?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch(actionCreator());
                    } else {
                        dispatch(actionCreator());
                    }
                } else if (action.actionCreator) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`*************************ACTION: {${action.actionCreator?.typePrefix || action.actionCreator?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch(action.actionCreator());
                    } else {
                        dispatch(action.actionCreator());

                    }
                }
            }

            if (!action.canRefetch) {
                action._fetched = true;
            }
        }

        return isLoopBroken;
    }
    private setup = createAsyncThunk<
        void,
        TStateSetUpArgs,
        IThunkConfig
    >(
        '@@INIT:STATE',
        async (
            {
                pathname,
                pageNumber,
                asyncReducer,
                type
            },
            {
                rejectWithValue,
                getState,
                dispatch
            }
        ) => {
            flowState.calls[type].count = flowState.calls[type].count + 1;
            console.log(`%c@@INIT:STATE{${pathname}}`, 'color: #ed149a', { $AppState: this.$AppState });
            try {
                this.pageOptionsMap[pathname].pageNumber = pageNumber;
                const prevInitiated = this.flowStatus;
                let asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>['actionCreators'] = null;
                this.flowStatus = type;
                this.pageOptionsMap[pathname].isActionsCalling = true;

                console.log('%csetUp::start', 'color: #ed149a', {
                    pathname,
                    isAppReady: getState().app.isAppReady,
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
                        let removeOptions;

                        if (this.prevRoute?.mustDestroy) {
                            const prevAsyncReducerOptions = this.getPageOption(this.prevRoute.pathname, 'asyncReducerOptions');
                            removeOptions = await this.callReducerManager('remove', prevAsyncReducerOptions, getState, dispatch);
                        }

                        const addOptions = await this.callReducerManager('add', asyncReducerOptions, getState, dispatch);
                        asyncActionCreatorsOption = addOptions.asyncActionCreatorsOption;
                        await removeOptions?.callback?.({
                            prev: removeOptions.moduleNames,
                            current: addOptions.moduleNames
                        });
                        await addOptions?.callback?.({
                            prev: removeOptions?.moduleNames,
                            current: addOptions.moduleNames
                        });
                    }

                    if (asyncReducerOptions && !asyncActionCreatorsOption) {
                        asyncActionCreatorsOption = (await asyncReducerOptions(getState))['actionCreators'];
                    }
                }

                const isBroken = await this.callActions(pathname, dispatch, getState(), asyncActionCreatorsOption);
                const isPageNotFound = this.pageOptionsMap[this.currentRoute!]._notFound;
                if (isBroken) {
                    flowState.calls[type].breakCount = flowState.calls[type].breakCount + 1;
                }

                console.info('%csetUp::end', 'color: #ed149a', {
                    pathname, isAppReady:
                    getState().app.isAppReady,
                    state: getState(),
                    $AppState: this.$AppState,
                    prevInitiated,
                    type
                });

                if (
                    !isBroken
                    && (this.currentRoute === pathname || isPageNotFound)
                    && this.isActionsCalling(this.currentRoute!)/*&& this.flowStatus === type*/
                ) {
                    console.log('%csetUp->PAGE_IS_READY', 'color: #ed149a', flowState.get());

                    this.prevRoute = {
                        pathname,
                        ready: true,
                    };
                    if (this.redirectTo) {
                        this.redirectTo = null;
                    }
                    this.flowStatus = null;
                    this.pageOptionsMap[isPageNotFound ? this.currentRoute! : pathname].isActionsCalling = false;
                    if (this.loading === null && this.loadingCount !== null && Math.round(this.loadingCount) === this.loadingCount) {
                        if (!flowState['useEffect: Update'].____RedirectModal_____.MODAL && this.restart !== RestartTypes.AuthExpired) {
                            flowState.reset();
                        }

                        this.loadingCount = 0;
                        if (isPageNotFound) {
                            delete this.pageOptionsMap[this.currentRoute!];
                        }
                    }
                }
            } catch (err) {
                console.error('setUp::catch', err);
                this.pageOptionsMap[pathname].isActionsCalling = false;
                return rejectWithValue('Something went wrong!');
            } finally {
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

    private getPathnameWithPattern = (pathname: string) => {
        for (let i = 0; i < this.stateSetupConfigDynamicPaths.length; i++) {
            const pattern = this.stateSetupConfigDynamicPaths[i];
            const regexPattern = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
                .replace(/:[^/]+/g, '([^/]+)');
            const regex = new RegExp(`^${regexPattern}${pathname.endsWith('/') && pathname !== '/' ? '|$' : '$'}`);

            if (regex.test(pathname)) {
                return pattern;
            }
        }
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
        const pathnameWithPattern = this.getPathnameWithPattern(pathname) || pathname;
        const params = matchPath({ path: pathnameWithPattern }, pathname)?.params;
        const [ searchParams ] = useSearchParams();
        const navigate = useNavigate();
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: START', {
            $AppState: this.$AppState,
            pathname,
            pathnameWithPattern
        });

        if (this.currentRoute !== pathnameWithPattern && this.flowStatus !== FlowStatuses.Start) {
            this._initiatedState.reset(true);
        }

        if (!this.initiatedState._initiated) {
            if (this.isAuth !== null && this.pageOptionsMap[pathnameWithPattern]?.isPageLoaded === undefined) {
                dispatch(this.setIsPageReady(false));
            }
            if (this.restart === RestartTypes.OnAuth) {
                dispatch(this.setIsAppReady(true));
            }
            this._initiatedState.activate();
            this.pageNumber = this.pageNumber + 1;
            this.initiatedState.currentPageCount = this.pageNumber;
            if (this.currentRoute !== pathnameWithPattern) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_CURRENT_ROUTE');
                if (this.currentRoute) {
                    this.prevRoute = { pathname: this.currentRoute };
                }
                this.currentRoute = pathnameWithPattern;
            }
            if (this.prevRoute && this.prevRoute.pathname !== pathnameWithPattern) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'mustDestroy', this.prevRoute);
                this.prevRoute.mustDestroy = true;
            }
            this.updateBasePageOptions({
                pathname: pathnameWithPattern,
                searchParams,
                params
            });

            const { waitUntil } = this.getPageOption(pathnameWithPattern, 'onNavigate') || {};
            const redirectTo = this.getRedirectTo(pathnameWithPattern);
            this.initiatedState.mustRedirectTo = this.isAuth !== null ? redirectTo : null;
            this.initiatedState.mustActivateLoading = Boolean(this.loading !== LoadingTypes.Loading
                && waitUntil
                && !this.isPageLoaded(this.initiatedState.mustRedirectTo || pathnameWithPattern)
                && (!state?.from || this.restart === RestartTypes.AuthExpired)
                && this.prevRoute?.pathname !== this.initiatedState.mustRedirectTo
            );

            if (
                (this.flowStatus === FlowStatuses.Setup || this.flowStatus === FlowStatuses.SetupFirst)
                && this.prevRoute
                && !state?.from
            ) {
                if (this.prevRoute.pathname !== this.currentRoute) {
                    if (this.isActionsCalling(this.prevRoute!.pathname)) {
                        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_BREAK');
                        this.setBreakPageActions(this.prevRoute!.pathname, this.pageOptionsMap[this.prevRoute!.pathname].pageNumber!);
                    }
                } else {
                    this.pageOptionsMap[this.currentRoute].pageNumber = this.pageNumber;
                    this.initiatedState.stopActionsRecall = true;
                }
            }

            if (this.initiatedState.mustActivateLoading) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'PRE-SET_LOADING');
                if (this.loading === LoadingTypes.Suspense) {
                    this.initiatedState.mustActivateLoading = false;
                }
                this.loading = LoadingTypes.Loading;
                const onLoading = this.getPageOption(pathnameWithPattern, 'onLoading');
                onLoading?.(dispatch, this.getPublicPageOptions(this.pageOptionsMap[pathnameWithPattern]));
            }

            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: END', {
                $AppState: this.$AppState,
                pathname,
                pathnameWithPattern,
                initiatedState: JSON.parse(JSON.stringify(this.initiatedState)),
                redirectTo,
                waitUntil,
                stateFrom: state?.from
            });
        }

        useLayoutEffect(() => {
            if (!flowState.navigate) {
                flowState.navigate = navigate;
            }
            if (this.initiatedState.mustRedirectTo) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'REDIRECT');
                const redirectTo = this.getRedirectTo(pathnameWithPattern)!;
                this.updateBasePageOptions({
                    pathname: redirectTo,
                    searchParams
                });

                navigate(redirectTo, { state: { from: pathnameWithPattern } });
            }
            if (this.initiatedState.mustActivateLoading && this.loading === LoadingTypes.Loading) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'SET_LOADING');
                dispatch(this.setLoading(true));
            }
        });

        useEffect(() => {
            const mustCheckAuth = !this.isAuthChecking
                && this.flowStatus === FlowStatuses.Start
                && (this.isAuth === null || Boolean(this.isAuth));
            const mustCallActions = (!this.getPageOption(pathnameWithPattern, 'onNavigate')?.waitUntil || this.isAuth === false)
                && !this.isActionsCalling(pathnameWithPattern)
                && !this.initiatedState.stopActionsRecall
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
                pathnameWithPattern,
                mustCheckAuth,
                initiatedState: JSON.parse(JSON.stringify(this.initiatedState)),
                mustCallActions,
                mustShowRedirectionModal,
                $AppState: this.$AppState
            }, 'PagesCount=' + this.pageNumber);

            if (mustShowRedirectionModal) {
                this.redirectionContext = {
                    redirectTo: pathname,
                    from: state.from,
                    type: RedirectionTypes.NotFirstRender,
                    isPageLoaded: this.isPageLoaded(pathnameWithPattern)
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
                    pathname: this.initiatedState.mustRedirectTo || pathnameWithPattern,
                    pageNumber: this.initiatedState.mustRedirectTo
                        ? this.initiatedState.currentPageCount + 1
                        : this.initiatedState.currentPageCount,
                    type: FlowStatuses.SetupFirst,
                    asyncReducer
                });
            }

            if (mustCheckAuth) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                    '============CheckAuth=============', { $AppState: this.$AppState }
                );
                checkAuth({
                    pathname: pathnameWithPattern,
                    searchParams,
                }).then((result) => {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                        '============CheckAuth=============: AFTER', {
                            $AppState: this.$AppState,
                            result,
                            pathname,
                            pathnameWithPattern,
                        }
                    );
                    if (this.checkAuthorization.fulfilled.match(result)) {
                        if (!this.isActionsCalling(this.currentRoute!) && (
                            result.payload.redirectTo
                                ? (!this.initiatedState.mustRedirectTo || this.restart === RestartTypes.AuthExpired)
                                : result.payload.waitUntil
                        )
                        ) {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============SetUp>>>CheckAuth=============', {
                                result,
                                pathname,
                                pathnameWithPattern,
                                $AppState: this.$AppState
                            });
                            setup({
                                pageNumber: result.payload.redirectTo ? this.pageNumber + 1 : this.pageNumber,
                                pathname: result.payload.redirectTo || this.currentRoute!,
                                type: FlowStatuses.Setup,
                                asyncReducer
                            });
                        }

                        if (result.payload.redirectTo && (!this.initiatedState.mustRedirectTo || this.restart === RestartTypes.AuthExpired)) {
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

            this._initiatedState.reset();
        });
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '...STARTING[effects]', {
            initiatedState: JSON.parse(JSON.stringify(this.initiatedState)),
            from: state?.from,
            pathname,
            pathnameWithPattern,
            'this.$AppState': this.$AppState,
        });

        return pathname;
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
            return () => {
                if (loading && !this.loadingCount) {
                    if (!flowState['useEffect: Update'].____RedirectModal_____.MODAL) {
                        flowState.reset();
                    }
                }
            };
        });

        useLayoutEffect(() => {
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
                const onLoading = this.getPageOption(pathname, 'onLoading');
                onLoading?.(dispatch, this.getPublicPageOptions(this.pageOptionsMap[pathname]));
                dispatch(this.setLoading(true));
            }

            return () => {
                const isPageNotFound = this.pageOptionsMap[this.currentRoute!]._notFound;
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
                                || isPageNotFound
                                || (this.restart === RestartTypes.AuthExpired && this.isPageLoaded(this.currentRoute!))
                            )
                        : false
                ) {
                    console.log(`%c____LOADER_____{${pathname}}`, 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', '+++Clear+++');
                    if (pathname === this.currentRoute || isPageNotFound) {
                        this.pageOptionsMap[pathname].isPageLoaded = true;
                    }

                    this.loading = null;
                    dispatch(this.setLoading(false));
                    if (this.prevRoute?.ready && this.loadingCount && Math.round(this.loadingCount) === this.loadingCount) {
                        this.loadingCount = 0;
                        if (isPageNotFound) {
                            delete this.pageOptionsMap[this.currentRoute!];
                        }
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
        ({ app }: IStateSchema) => app.isAppReady,
        (isReady) => {
            const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};

            console.log('%c$$$getIsPageReady$$$', 'color: #22af2c', {
                pathname,
                isReady,
                waitUntil,
                $AppState: this.$AppState
            });
            if (!waitUntil || (this.restart && this.prevRoute?.pathname !== pathname)) {
                return true;
            }

            return isReady && (pathname === this.redirectTo || this.redirectTo === null);
        }
    );

    public ProtectedElement: FC<PropsWithChildren<{
        pathname: string;
        PageLoader?: ComponentType;
        lazy?: true;
    }>> = ({
            children,
            pathname,
            PageLoader,
            lazy: isLazy =  false
        }) => {
            const isPageReady = useSelector(this.getIsPageReady(pathname));
            const lazy = this.isElementLazyLoaded(children) || isLazy;
            const dispatch = useDispatch<TDispatch>();
            const [ searchParams ] = useSearchParams();
            if (pathname === '*') {
                this.updateBasePageOptions({
                    pathname,
                    searchParams
                }, this.currentRoute!);
            }
            if (lazy) {
                this.pageOptionsMap[pathname]._lazy = true;
            }

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
                this.updateBasePageOptions({
                    pathname: redirectTo,
                    searchParams
                });

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
