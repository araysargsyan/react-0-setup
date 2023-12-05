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
    useState, useMemo,
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
    type TUseRedirectionContext
} from '../types';


class StateSetup {
    private readonly basePageOptions: IPageOptions & {isPageLoaded: boolean; isActionsCalling: boolean} = {
        actions: [],
        authRequirement: null,
        isPageLoaded: false,
        isActionsCalling: false
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;
    private readonly authProtectionConfig: IAuthProtection;
    private readonly PageLoader: ComponentType | null;

    private isAuth: boolean | null = null;
    private redirectTo: null | string = null;
    private hasRedirectionModal: boolean = false;
    private loading: null | 'LOADING' | 'SUSPENSE' = null;
    private waitUntil = false; //* for not lazy loaded components
    private restart: 'AUTH' | 'AUTH_EXPIRED' | null = null;
    private flowStatus: null | 'START' | 'AUTH_CHECK' | 'AUTH_FIRST' | 'SETUP' | 'SETUP_FIRST' | 'BREAK_SETUP' = null;
    private currentRoute: string = '';
    private prevRoute: {
        pathname: string;
        mustDestroy: boolean;
        redirectedFrom?: string;
    } | null = null;
    private pageOptionsMap: Record<string, IPageOptions & {isPageLoaded: boolean; isActionsCalling: boolean; _break?: Record<number, boolean>}> = {};
    private asyncReducer: TAsyncReducer | null = null;
    private redirectionContext: ReturnType<TUseRedirectionContext>['context'] = null;
    private pageCount = 0;
    private isAuthChecking = false;

    private get $AppState() {
        return {
            isAuth: this.isAuth,
            isAuthChecking: this.isAuthChecking,
            flowStatus: this.flowStatus,
            currentRoute: this.currentRoute,
            redirectTo: this.redirectTo,
            loading: this.loading,
            waitUntil: this.waitUntil,
            restart: this.restart,
            prevRoute: JSON.parse(JSON.stringify(this.prevRoute)),
            pageOptionsMap: JSON.parse(JSON.stringify(this.pageOptionsMap)),
            redirectionContext: JSON.parse(JSON.stringify(this.redirectionContext)),
            asyncReducer: this.asyncReducer,
            pageCount: this.pageCount
        };
    };

    private reducer!: Reducer;
    private setIsAuthenticated!: TSetIsAuthenticated;
    private setIsAppReady!: ActionCreatorWithPayload<boolean>;
    private setLoading!: ActionCreatorWithPayload<boolean>;
    private setIsPageReady!: ActionCreatorWithPayload<boolean>;
    private setShowRedirectionModal!: ActionCreatorWithPayload<boolean>;

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
        this.authProtectionConfig = authProtectionConfig;
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

    private setBreakPageActions(pathname: string, pageCount: number) {
        console.log('setBreakPageActions', pathname, pageCount);
        this.redirectTo = null;
        // this.flowStatus = 'BREAK_SETUP';
        if (this.pageOptionsMap[pathname]._break) {
            this.pageOptionsMap[pathname]._break![pageCount] = true;
        } else {
            this.pageOptionsMap[pathname]._break = { [pageCount]: true };
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
        this.isAuthChecking = true;
        const pageCount = this.pageCount;
        const prevInitiated = this.flowStatus;

        try {
            const prevRedirectTo = this.getRedirectTo(this.flowStatus === 'START' ? this.currentRoute : pathname);
            // const prevRoute = this.prevRoute;
            //
            // this.prevRoute = {
            //     pathname,
            //     mustDestroy: false
            // };

            const isAuth = await checkAuthorization({ isAuth: this.isAuth }, thunkAPI);
            // const mustRedirectTo = (Boolean(prevRoute) || null) && prevRedirectTo;
            const isAuthExpired = typeof isAuth === 'boolean' && this.isAuth && isAuth !== this.isAuth;

            if (typeof isAuth === 'boolean') {
                this.isAuth = isAuth;
                thunkAPI.dispatch(this.setIsAuthenticated(isAuth));
            } else {
                throw new Error('checkAuthorization');
            }

            // const redirectTo = this.getRedirectTo(isAuthExpired ? mustRedirectTo || this.currentRoute : this.currentRoute);
            const redirectTo = this.getRedirectTo(isAuthExpired
                ? this.prevRoute?.pathname || this.currentRoute
                : this.currentRoute
            );
            if (redirectTo) {
                this.updateBasePageOptions(redirectTo, searchParams);

                if (isAuthExpired) {
                    console.log('%cAuthorization', 'color: #076eab', 'AUTH_EXPIRED');
                    this.restart = 'AUTH_EXPIRED';
                }
            }

            const { waitUntil } = this.getPageOption(redirectTo || this.currentRoute, 'onNavigate') || {};
            console.log('%cAuthorization', 'color: #076eab', 'AFTER_CHECK_AUTH', {
                redirectTo,
                prevRedirectTo,
                // mustRedirectTo,
                pathname,
                isAuthExpired,
                isAuth,
                waitUntil,
                prevInitiated,
                pageCount,
                $AppState: this.$AppState
            });

            return thunkAPI.fulfillWithValue({
                redirectTo,
                mode,
                waitUntil: waitUntil || null
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
                pageCount,
            });
            if (this.currentRoute !== pathname) {
                console.log('%cAuthorization', 'color: #076eab', 'SET_BREAK');
                this.setBreakPageActions(pathname, pageCount);
            } else if (prevInitiated === 'SETUP_FIRST' /*&& isAuthFirst*/) {
                // this.flowStatus = null;
            }
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
        this.setShowRedirectionModal = createAction(
            `${appReducerName}/setShowRedirectionModal`,
            (payload: boolean) => ({ payload })
        );
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isAppReady: false,
            isPageReady: false,
            isAuthenticated: false,
            loadingCount: 0,
            loading: false,
            showRedirectionModal: false,
        }, (builder) => {
            builder
                .addCase(this.checkAuthorization.fulfilled, (
                    state,
                    {
                        payload: {
                            redirectTo, mode, waitUntil
                        }
                    }
                ) => {
                    if (mode === 'APP') {
                        if (this.restart === 'AUTH_EXPIRED') {
                            state.isPageReady = false;
                            this.redirectTo = redirectTo;
                        } else {
                            if (this.waitUntil) {
                                this.waitUntil = false;
                                this.loading = null;
                                state.loading = false;
                                state.loadingCount = state.loadingCount + 0.5;
                            }
                            state.isAppReady = true;

                            if (redirectTo === null) {
                                state.isPageReady = true;
                            } else {
                                this.redirectTo = redirectTo;
                                state.isPageReady = true;
                            }
                        }
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
                            this.restart = 'AUTH';
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
                    state.loading = payload;
                    state.loadingCount = state.loadingCount + 0.5;
                })
                .addCase(this.setIsPageReady, (state, { payload }) => {
                    state.isPageReady = payload;
                })
                .addCase(this.setShowRedirectionModal, (state, { payload }) => {
                    state.showRedirectionModal = payload;
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
        const pageCount = this.pageCount;
        const actions = this.getPageOption(pathname, 'actions');
        console.log('*************************START_callActions', {
            pathname,
            pageCount,
            actions
        });

        for (let i = 0; i < actions.length; i++) {
            console.log('*************************callAction', {
                $AppState: this.$AppState, pathname, mustBreak: this.currentRoute !== pathname, pageCount
            });

            if (this.pageOptionsMap[pathname]._break?.[pageCount]) {
                delete this.pageOptionsMap[pathname]._break?.[pageCount];
                // this.pageOptionsMap[pathname].isActionsCalling = false;
                isLoopBroken = true;
                console.log('*************************BREAK', pathname);
                break;
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
                    // @ts-ignore
                    console.log(`*************************ACTION: {${cb?.typePrefix || cb?.type}}`, pathname);
                    if (isAsync) {
                        await dispatch(cb());
                    } else {
                        dispatch(cb());
                    }
                } else {
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
                        ? this.authProtectionConfig.unAuthorized
                        : null)
                : (this.isAuth
                        ? this.authProtectionConfig.authorized
                        : null);
        }

        return redirectTo !== pathname ? redirectTo : null;
    };

    private isPageLoaded = (pathname: string) => Boolean(this.pageOptionsMap[pathname]?.isPageLoaded);
    private isElementLazyLoaded(Element: any) {
        let element = Element;

        while (Boolean(element.type)) {
            element = element.type;
        };

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
            console.log('%c@@INIT:STATE', 'color: #ed149a', { $AppState: this.$AppState });
            let mustClearInitiated = false;

            try {
                const prevRoute = this.prevRoute;
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
                    prevRoute,
                    type
                });

                if (asyncReducer && this.asyncReducer === null) {
                    this.asyncReducer = asyncReducer;
                }
                if (this.asyncReducer) {
                    const asyncReducerOptions = this.getPageOption(pathname, 'asyncReducerOptions');

                    if (prevRoute?.pathname !== pathname) {
                        if (prevRoute?.mustDestroy) {
                            const asyncReducerOptions = this.getPageOption(prevRoute.pathname, 'asyncReducerOptions');
                            await this.callReducerManager('remove', asyncReducerOptions, getState(), dispatch);
                        }

                        asyncActionCreatorsOption = await this.callReducerManager('add', asyncReducerOptions, getState(), dispatch);
                    }

                    if (asyncReducerOptions && !asyncActionCreatorsOption) {
                        asyncActionCreatorsOption = (await asyncReducerOptions(getState()))[1];
                    }
                }

                const isBroken = await this.callActions(pathname, dispatch, getState(), asyncActionCreatorsOption);

                console.info('%csetUp::end', 'color: #ed149a', {
                    pathname, isAppReady:
                    getState().app.isAppReady,
                    mode,
                    prevRoute,
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
                    this.prevRoute = {
                        pathname,
                        mustDestroy: false
                    };
                    console.log('%csetUp->PAGE_IS_READY', 'color: #ed149a');
                    mustClearInitiated = true;
                    console.log('%csetUp->ClearInitiated', 'color: #ed149a');
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

                console.log('%csetUp::finally', 'color: #ed149a', { state: getState().app, $AppState: this.$AppState });
            }
        }
    );

    private useContext = () => {
        const show = useSelector(({ app }: IStateSchema) => app.showRedirectionModal);
        const dispatch = useDispatch();

        return {
            closeRedirectionModal: () => {
                if (this.redirectionContext) {
                    this.redirectionContext = null;
                    dispatch(this.setShowRedirectionModal(false));
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
        const prevRoute = this.currentRoute || pathname;
        const isLoadingActivated = useRef(false);
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: START', {
            $AppState: this.$AppState,
            pathname
        });

        if (this.currentRoute !== pathname) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_CURRENT_ROUTE');
            this.pageCount = this.pageCount + 1;
            this.currentRoute = pathname;
        }
        if (
            (this.flowStatus === 'SETUP' || this.flowStatus === 'SETUP_FIRST')
            && !this.isAuthChecking && prevRoute !== this.currentRoute
        ) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'SET_BREAK');
            this.setBreakPageActions(prevRoute, this.pageCount - 1 || 1);
        }
        if (!this.pageOptionsMap[pathname]) {
            this.updateBasePageOptions(pathname, searchParams);
        }
        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'INIT: END', {
            $AppState: this.$AppState,
            pathname
        });

        const currentPageCount = this.pageCount;
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const redirectTo = this.getRedirectTo(pathname);
        const mustRedirectTo = this.isAuth !== null && redirectTo;
        const mustActivateLoading = this.loading !== 'LOADING'
            && waitUntil
            && !this.pageOptionsMap[mustRedirectTo || pathname]?.isPageLoaded
            && (!state?.from || this.restart === 'AUTH_EXPIRED')
            && this.prevRoute?.pathname !== redirectTo;

        if (mustActivateLoading) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'PRE-SET_LOADING');
            isLoadingActivated.current = false;
            this.loading = 'LOADING';
        }
        if (this.prevRoute && this.prevRoute.pathname !== pathname) {
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'mustDestroy', this.prevRoute);
            this.prevRoute.mustDestroy = true;
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
            if (this.flowStatus === 'START') {
                if (mustRedirectTo) {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'REDIRECT');
                    if (!this.pageOptionsMap[redirectTo]) {
                        this.updateBasePageOptions(redirectTo, searchParams);
                    }

                    navigate(redirectTo, { state: { from: pathname } });
                }
                if (this.loading === 'LOADING' && !isLoadingActivated.current /*&& !this.redirectTo && !state?.from*/) {
                    isLoadingActivated.current = true;
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'SET_LOADING');
                    dispatch(this.setLoading(true));
                }
            }
        });

        useEffect(() => {
            const mustCheckAuth = !this.isAuthChecking
                && this.flowStatus === 'START'
                && (this.isAuth === null || Boolean(this.isAuth));
            const mustCallActions = !waitUntil
                && !this.redirectTo
                && (!state?.from || this.restart !== 'AUTH_EXPIRED');
            const mustShowRedirectionModal = this.flowStatus === 'START'
                && this.hasRedirectionModal
                && !this.redirectionContext
                && state?.from
                && !mustCheckAuth;
            console.log('%c____usePageStateSetUp____: UPDATE', 'color: #ae54bf', {
                stateFrom: state?.from,
                pathname,
                waitUntil,
                mustCheckAuth,
                mustCallActions,
                mustShowRedirectionModal,
                $AppState: this.$AppState
            }, 'PagesCount=' + this.pageCount);

            if (mustShowRedirectionModal) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                this.redirectionContext = {
                    redirectTo: pathname,
                    from: state.from,
                    type: 'NOT_FIRST_RENDER',
                    isPageLoaded: this.isPageLoaded(pathname)
                };
                dispatch(this.setShowRedirectionModal(true));
            }

            if (mustCallActions) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf',
                    '============SetUp=============', this.currentRoute
                );
                setup({
                    mode: 'APP',
                    type: 'SETUP_FIRST',
                    pathname: mustRedirectTo || pathname,
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
                    if (this.checkAuthorization.fulfilled.match(result)) {
                        if (!this.pageOptionsMap[pathname]._break?.[currentPageCount]) {
                            if (result.payload.redirectTo || !this.pageOptionsMap[pathname].isActionsCalling) {
                                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============SetUp>>>CheckAuth=============', {
                                    result,
                                    pathname,
                                    $AppState: this.$AppState
                                });
                                setup({
                                    type: 'SETUP',
                                    mode: 'APP',
                                    pathname: result.payload.redirectTo || this.currentRoute,
                                    asyncReducer
                                });
                            }
                        } else {
                            delete this.pageOptionsMap[pathname]._break?.[currentPageCount];
                        }

                        if (result.payload.redirectTo && (!mustRedirectTo || this.restart === 'AUTH_EXPIRED')) {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'REDIRECT');
                            this.redirectionContext = {
                                redirectTo: result.payload.redirectTo,
                                from: this.currentRoute,
                                type: this.restart || 'FIRST_RENDER',
                                isPageLoaded: this.isPageLoaded(result.payload.redirectTo)
                            };
                            this.hasRedirectionModal && dispatch(this.setShowRedirectionModal(true));
                            navigate(result.payload.redirectTo, { state: { from: this.currentRoute } });
                        } else if (this.hasRedirectionModal && this.redirectionContext?.type === 'NOT_FIRST_RENDER') {
                            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                            dispatch(this.setShowRedirectionModal(true));
                        }
                    }
                });
            }

            if (this.restart) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'CLEAN_STATE>RESTART');
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

    public createRedirectionModal = (modal: FC<{ useContext: TUseRedirectionContext }>) => {
        return memo(modal);
    };

    public StateSetupProvider: FC<PropsWithChildren<{
        asyncReducer?: TAsyncReducer;
        RedirectionModal?: FC<{ useContext: TUseRedirectionContext }>;
    }>> = ({
            children,
            asyncReducer,
            RedirectionModal
        }) => {
            if (this.flowStatus === null) {
                this.flowStatus = 'START';
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

    private getLoading = (type?: 'SUSPENSE', waitUntil?: Exclude<IPageOptions['onNavigate'], undefined>['waitUntil']) => createSelector(
        ({ app }: IStateSchema) => app.loadingCount,
        (loadingCount) => {
            let loading = false;
            console.log(888, this.isPageLoaded(this.currentRoute));
            if (
                type === 'SUSPENSE'
                && !waitUntil
                // && this.loading !== 'LOADING'
                && !this.isPageLoaded(this.currentRoute)
            ) {
                loading = true;
            } else if (!type && this.loading === 'LOADING') {
                loading = true;
            }

            console.log(`%c$$$getLoading$$$-${this.pageCount}`, 'color: #dbd518', {
                type,
                waitUntil,
                loadingCount,
                loading,
                $AppState: this.$AppState
            });
            return loading;
        });

    // eslint-disable-next-line react/display-name
    private Loader = memo<{
        type?: 'SUSPENSE'; pathname: string; PageLoader?: ComponentType;
    }>(({
        type, pathname, PageLoader
    }) => {
        const dispatch = useDispatch();
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const loading = useSelector(this.getLoading(type, waitUntil));

        useEffect(() => {
            console.log('%c____LOADER_____: UPDATE', 'color: #dbd518', {
                type: type || 'LOADING',
                waitUntil,
                loading,
                pathname,
                $AppState: this.$AppState
            });
        });

        useLayoutEffect(() => {
            if (type === 'SUSPENSE' && loading && this.loading !== 'SUSPENSE') {
                this.loading = 'SUSPENSE';
                console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect');
                if (this.loading === null) {
                    dispatch(this.setLoading(true));
                }
            }

            return () => {
                console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', {
                    type: type || 'LOADING',
                    loading,
                    pathname,
                    $AppState: this.$AppState
                });

                if (type === 'SUSPENSE' && (pathname === this.currentRoute /*|| this.loading === 'LOADING'*/) && !this.isPageLoaded(pathname)) {
                    console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', '+++Clear+++');
                    if (pathname === this.currentRoute) {
                        this.pageOptionsMap[pathname].isPageLoaded = true;
                    }
                    this.loading = null;
                    dispatch(this.setLoading(false));
                    console.log('__________FIRST RENDER____________', { $AppState: this.$AppState });
                }
            };
        }, [ loading, dispatch, type, pathname ]);

        console.log(`%c____LOADER_____{${type || 'LOADING'}}`, 'color: #dbd518', {
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
        });

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

        if (!lazy && this.loading === 'LOADING') {
            console.log(22222222222);
            this.waitUntil = true;
        }

        useEffect(() => {
            console.log('%c____ProtectedElement_____: UPDATE', 'color: #22af2c', {
                pathname,
                isPageReady,
                'this.$AppState': this.$AppState,
            });
        });

        useLayoutEffect(() => {
            if (this.loading === 'LOADING' && this.restart === 'AUTH' && redirectTo && !this.isPageLoaded(redirectTo)) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'useLayoutEffect', 'SET-LOADING', { $AppState: this.$AppState, pathname });
                dispatch(this.setLoading(true));
            }
            if (this.hasRedirectionModal && this.restart && this.redirectionContext?.type === 'AUTH') {
                dispatch(this.setShowRedirectionModal(true));
            }
        }, [ isPageReady, dispatch, pathname, redirectTo ]);

        if (redirectTo && this.restart === 'AUTH') {
            console.log('%c____ProtectedElement_____', 'color: #22af2c', 'redirecting', { $AppState: this.$AppState });

            if (!this.pageOptionsMap[redirectTo]) {
                this.updateBasePageOptions(redirectTo, searchParams);
            }
            const { waitUntil } = this.getPageOption(redirectTo, 'onNavigate') || {};
            if (!this.loading && waitUntil && !this.isPageLoaded(redirectTo)) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'PRE_SET-LOADING');
                this.loading = 'LOADING';
            }

            this.redirectionContext = {
                redirectTo,
                from: pathname,
                type: 'AUTH',
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
                    { this.loading === 'LOADING' ? (
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
                { this.loading === 'LOADING' ? (
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
                                                type={ 'SUSPENSE' }
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
            actionCreators: { setIsAuthenticated: this.setIsAuthenticated, },
        };
    }
}
export default StateSetup;
