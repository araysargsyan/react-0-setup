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
    useState,
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
    private readonly basePageOptions: IPageOptions & {isPageLoaded: boolean} = {
        actions: [],
        authRequirement: null,
        isPageLoaded: false
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;
    private readonly authProtectionConfig: IAuthProtection;
    private readonly PageLoader: ComponentType | null;

    private isAuth: boolean | null = null;
    private initiated: boolean = false;
    private redirectTo: null | string = null;
    private loading: boolean = false; //* when have waited
    private waitUntil = false; //* for not lazy loaded components
    private restart: 'AUTH' | 'AUTH_EXPIRED' | null = null;
    private prevRoute: {
        pathname: string;
        mustDestroy: boolean;
        redirectedFrom?: string;
    } | null = null;
    private pageOptionsMap: Record<string, IPageOptions & {isPageLoaded: boolean}> = {};
    private asyncReducer: TAsyncReducer | null = null;
    private redirectionContext: ReturnType<TUseRedirectionContext>['context'] = null;

    private get $AppState() {
        return {
            isAuth: this.isAuth,
            initiated: this.initiated,
            redirectTo: this.redirectTo,
            loading: this.loading,
            waitUntil: this.waitUntil,
            restart: this.restart,
            prevRoute: JSON.parse(JSON.stringify(this.prevRoute)),
            pageOptionsMap: JSON.parse(JSON.stringify(this.pageOptionsMap)),
            redirectionContext: JSON.parse(JSON.stringify(this.redirectionContext)),
            asyncReducer: this.asyncReducer,
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

    private initAuth: TInitAuth = async (
        {
            checkAuthorization,
            pathname,
            searchParams,
            mode,
            mustRedirectTo
        },
        thunkAPI
    ) => {
        try {
            const isAuth = await checkAuthorization({ isAuth: this.isAuth }, thunkAPI);

            if (typeof isAuth === 'boolean') {
                if (this.isAuth && isAuth !== this.isAuth) {
                    console.log('++++AUTH_EXPIRED++++');
                    this.restart = 'AUTH_EXPIRED';
                }
                this.isAuth = isAuth;
                thunkAPI.dispatch(this.setIsAuthenticated(isAuth));
            } else {
                throw new Error('checkAuthorization');
            }

            const redirectTo = this.getRedirectTo(this.restart === 'AUTH_EXPIRED' ? mustRedirectTo || pathname : pathname);
            if (redirectTo) {
                this.updateBasePageOptions(redirectTo, searchParams);
            }

            const { waitUntil } = this.getPageOption(redirectTo || pathname, 'onNavigate') || {};

            // console.log(3333, {
            //     $AppState: this.$AppState, redirectTo, waitUntil, isAuth, pathname, mustRedirectTo
            // });

            return thunkAPI.fulfillWithValue({
                redirectTo,
                mode,
                waitUntil: waitUntil || null
            });
        } catch (e) {
            console.log(e);
            return thunkAPI.rejectWithValue('error');
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
                            // console.log(222222222, 'AUTH_EXPIRED');
                        } else {
                            if (this.waitUntil) {
                                this.waitUntil = false;
                                this.loading = false;
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
                    } else {
                        if (redirectTo === null) {
                            if (waitUntil === 'CHECK_AUTH') {
                            } else if (waitUntil === 'SETUP') {
                                this.initiated = false;
                            } else {
                            }
                        } else {
                            this.initiated = false;
                        }
                    }
                })
                .addCase(this.setup.fulfilled, (state, { payload: { isAppReady, mode } }) => {
                    if (mode === 'APP') {
                        state.isAppReady = Boolean(isAppReady);
                        state.isPageReady = Boolean(isAppReady);
                    } else {
                        state.isPageReady = Boolean(isAppReady);
                    }
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
        actions: IPageOptions['actions'],
        dispatch: TDispatch,
        state: IStateSchema,
        asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1]
    ) {
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const isAsync = action.async;

            if (typeof action.canRefetch === 'function') {
                action._fetched = !action.canRefetch(state);
            }

            if (!action._fetched) {
                if (asyncActionCreatorsOption
                    && typeof action.cb === 'object'
                    && asyncActionCreatorsOption[action.cb.key]
                ) {
                    const cb = action.cb.getAction(asyncActionCreatorsOption[action.cb.key]);
                    if (isAsync) {
                        await dispatch(cb());
                    } else {
                        dispatch(cb());
                    }
                } else {
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
    }

    private getRedirectTo(pathname: string) {
        const authRequirement= this.getPageOption(pathname, 'authRequirement');

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

        return redirectTo;
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
        { isAppReady: boolean | null; mode: TMode },
        TStateSetUpArgs,
        IThunkConfig
    >(
        '@@INIT:STATE',
        async (
            {
                pathname,
                mode,
                asyncReducer
            },
            {
                rejectWithValue,
                fulfillWithValue,
                getState,
                dispatch
            }
        ) => {
            console.log('%c@@INIT:STATE', 'color: #ed149a');
            try {
                let asyncActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1] = null;
                console.info({
                    pathname,
                    isAppReady: getState().app.isAppReady,
                    mode,
                    state: getState(),
                    asyncReducer,
                    p: this.prevRoute
                }, 'setUp::start');

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

                const actions = this.getPageOption(pathname, 'actions');

                await this.callActions(actions, dispatch, getState(), asyncActionCreatorsOption);

                console.info({
                    pathname, isAppReady:
                    getState().app.isAppReady,
                    mode,
                    state: getState()
                }, 'setUp::end');
                this.prevRoute = {
                    pathname,
                    mustDestroy: false
                };
                return fulfillWithValue({ isAppReady: true, mode });
            } catch (err) {
                console.error('setUp::catch', err);
                return rejectWithValue('Something went wrong!');
            } finally {
                if (this.redirectTo) {
                    this.redirectTo = null;
                }
                console.log('setUp::finally', { state: getState().app, $AppState: this.$AppState });
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

        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '::START', {
            pathname,
            from: state?.from,
            'this.$AppState': this.$AppState,
        });

        if (!this.pageOptionsMap[pathname]) {
            this.updateBasePageOptions(pathname, searchParams);
        }
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const redirectTo = this.getRedirectTo(pathname);
        const mustRedirectTo = (Boolean(this.prevRoute) || null) && redirectTo;

        if (
            !this.pageOptionsMap[mustRedirectTo || pathname]?.isPageLoaded
            && this.prevRoute?.pathname !== redirectTo
            && !this.loading
            && waitUntil
            && !state?.from
        ) {
            this.loading = true;
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'PRE-SET_LOADING');
        }

        if (this.prevRoute && this.prevRoute.pathname !== pathname) {
            this.prevRoute.mustDestroy = true;
            console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'mustDestroy', this.prevRoute);
        }

        useLayoutEffect(() => {
            if (mustRedirectTo) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'REDIRECT');
                if (!this.pageOptionsMap[redirectTo]) {
                    this.updateBasePageOptions(redirectTo, searchParams);
                }

                navigate(redirectTo, { state: { from: pathname } });
            }
            if (this.loading && !this.redirectTo && !state?.from) {
                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'useLayoutEffect', 'SET_LOADING');
                dispatch(this.setLoading(true));
            }
        });

        useEffect(() => {
            console.log('%c____usePageStateSetUp____: UPDATE', 'color: #ae54bf', { pathname: pathname, $AppState: this.$AppState });
            const mustCheckAuth = this.isAuth === null || this.isAuth;

            if (state?.from && !this.redirectionContext) {
                console.log('000000');
                this.redirectionContext = {
                    redirectTo: pathname,
                    from: state.from,
                    type: 'NOT_FIRST_RENDER',
                    isPageLoaded: this.isPageLoaded(pathname)
                };
                if (!mustCheckAuth) {
                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                    dispatch(this.setShowRedirectionModal(true));
                }
            }

            if (!this.redirectTo) {
                if (!state?.from || this.restart) {

                    if (mustCheckAuth) {
                        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============CheckAuth=============');

                        checkAuth({
                            pathname, searchParams, mustRedirectTo, mode: 'APP'
                        }).then((result) => {
                            if (this.checkAuthorization.fulfilled.match(result) && waitUntil/* && result.payload.waitUntil === 'SETUP'*/) {
                                console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============SetUp>>>CheckAuth=============', {
                                    result, pathname, $AppState: this.$AppState
                                });

                                setup({
                                    mode: 'APP',
                                    pathname: result.payload.redirectTo || pathname,
                                    asyncReducer
                                });

                                if (result.payload.redirectTo && (!mustRedirectTo || this.restart === 'AUTH_EXPIRED')) {
                                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', 'REDIRECT');
                                    navigate(result.payload.redirectTo, { state: { from: pathname } });
                                    this.redirectionContext = {
                                        redirectTo: result.payload.redirectTo,
                                        from: pathname,
                                        type: this.restart || 'FIRST_RENDER',
                                        isPageLoaded: this.isPageLoaded(result.payload.redirectTo)
                                    };
                                    dispatch(this.setShowRedirectionModal(true));
                                    navigate(result.payload.redirectTo, { state: { from: pathname } });
                                } else if (this.redirectionContext?.type === 'NOT_FIRST_RENDER') {
                                    console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '=========SHOW_REDIRECTION_MODAL=========');
                                    dispatch(this.setShowRedirectionModal(true));
                                }
                            }
                        });
                    }
                    if (this.restart !== 'AUTH_EXPIRED' && (!waitUntil || !mustCheckAuth)) {
                        console.log('%c____usePageStateSetUp____', 'color: #ae54bf', '============SetUp=============');
                        setup({
                            mode: 'APP',
                            pathname: redirectTo || pathname,
                            asyncReducer
                        });
                    }
                }
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
            const pathname = this.usePageStateSetup(asyncReducer);

            useEffect(() => {
                console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
                    pathname, asyncReducer, $AppState: this.$AppState
                });
            });

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

            if (type === 'SUSPENSE' && !waitUntil && !this.loading) {
                loading = true;
            } else if (!type && this.loading) {
                loading = true;
            }

            console.log('%c$$$getLoading$$$', 'color: #dbd518', {
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
            if (type === 'SUSPENSE' && loading) {
                console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect');
                dispatch(this.setLoading(true));
            }

            return () => {
                console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', {
                    type: type || 'LOADING',
                    loading,
                    $AppState: this.$AppState
                });

                if (type === 'SUSPENSE' && !this.isPageLoaded(pathname)) {
                    console.log('%c____LOADER_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', '+++Clear+++');

                    this.pageOptionsMap[pathname].isPageLoaded = true;
                    this.loading = false;
                    dispatch(this.setLoading(false));
                    console.log('__________FIRST RENDER____________', { $AppState: this.$AppState });
                }
            };
        }, [ loading, dispatch, type, pathname ]);

        console.log(`%c____LOADER_____::${type || 'LOADING'}`, 'color: #dbd518', {
            'this.loading': this.loading,
            loading
        });
        console.log(6666, PageLoader);
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
        const [ isReady, setIsReady ] = useState(false);
        const shouldRerender = useRef(false);
        const dispatch = useDispatch<TDispatch>();
        const [ searchParams ] = useSearchParams();


        // useEffect(() => {
        //     console.log('%c____ProtectedElement_____: START', 'color: #22af2c', {
        //         pathname,
        //         prevRoute: this.prevRoute,
        //         // isPageReady,
        //         initiated: this.initiated,
        //         restart: this.restart,
        //         redirectTo: this.redirectTo,
        //     });
        //
        //     if (
        //         // this.redirectTo === null && this.initiated && (
        //         //     isPageReady
        //         //     || (this.restart && !isPageReady)
        //         // )
        //         // (this.redirectTo === null && this.initiated)
        //         || this.restart
        //
        //     ) {
        //         // if (this.prevRoute?.redirectedFrom) {
        //         //     this.initiated = false;
        //         // }
        //         console.log('%c____ProtectedElement_____: checkAuth & setup', 'color: #ea4566');
        //         if (this.isAuth !== false) { //! <AUTH> check auth then get redirectTo and call setup
        //             dispatch(this.checkAuthorization({
        //                 mode: 'PAGE',
        //                 pathname: this.prevRoute?.redirectedFrom || pathname,
        //                 searchParams
        //             })).then((result) => {
        //                 if (this.checkAuthorization.fulfilled.match(result)) {
        //                     const redirectTo = result.payload.redirectTo;
        //                     const path = this.prevRoute?.redirectedFrom || redirectTo || pathname;
        //                     this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;
        //                     console.log(6666, {
        //                         pathname, redirectTo, path,
        //                         prevRoute: this.prevRoute,
        //                         restart: this.restart,
        //                     });
        //                     dispatch(this.setup({
        //                         pathname: path,
        //                         mode: 'PAGE',
        //                     })).then((_) => {
        //                         // if (this.prevRoute?.redirectedFrom) {
        //                         //     delete this.prevRoute?.redirectedFrom;
        //                         // }
        //                         if (result.payload.waitUntil === 'SETUP') {
        //                             console.log(666666666);
        //                             setIsReady(!isReady);
        //                         }
        //                     });
        //                 }
        //             });
        //         } else { //! <NOT_AUTH> get redirectTo and call setup
        //             this.updateBasePageOptions(pathname, searchParams);
        //             const redirectTo = this.getRedirectTo(pathname);
        //             const path = redirectTo || pathname;
        //
        //             this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;
        //
        //             dispatch(this.setup({
        //                 pathname: path,
        //                 mode: 'PAGE'
        //             })).then((_) => {
        //                 if (shouldRerender.current) {
        //                     console.log('RERENDER', 777);
        //                     shouldRerender.current = false;
        //                     this.initiated = false;
        //                     setIsReady(!isReady);
        //                 }
        //             });
        //         }
        //     } else if (!this.initiated) {
        //         if (this.restart) {
        //             this.restart = false;
        //         }
        //         console.log(4444);
        //         if (this.redirectTo === pathname || this.redirectTo === null) {
        //             console.log(5555);
        //             // window.history.replaceState({}, document.title);
        //             this.initiated = true;
        //             this.redirectTo = null;
        //         }
        //
        //     }
        //     if (this.initiated && this.prevRoute?.redirectedFrom) {
        //         delete this.prevRoute?.redirectedFrom;
        //     }
        //     console.log('%c____ProtectedElement_____: END', 'color: #22af2c', {
        //         pathname,
        //         prevRoute: this.prevRoute,
        //         // isPageReady,
        //         initiated: this.initiated,
        //         restart: this.restart,
        //         redirectTo: this.redirectTo,
        //     });
        // });
        console.log('%c____ProtectedElement_____', 'color: #22af2c', '::START', {
            lazy,
            pathname,
            isPageReady,
            'this.$AppState': this.$AppState,
        });

        const redirectTo = this.getRedirectTo(pathname);
        const { waitUntil } = this.getPageOption(this.redirectTo || pathname, 'onNavigate') || {};
        if (waitUntil === 'SETUP') {
            shouldRerender.current = true;
        }


        useEffect(() => {
            console.log('%c____ProtectedElement_____: UPDATE', 'color: #22af2c', {
                pathname,
                isPageReady,
                'this.$AppState': this.$AppState,
            });
        });

        // if (
        //     // (!isPageLoaded && waitUntil) || //! first load scenario
        //     // (/*isPageReady &&*/ redirectTo !== null) || //! redirection scenario
        //     // (/*isPageReady === null &&*/ !this.restart) || //! restart scenario
        //     (
        //         (
        //             // this.prevRoute?.redirectedFrom ||
        //             this.initiated
        //         ) && waitUntil === 'SETUP'
        //     )
        // ) {
        //     // if (!this.loading) {
        //     //     dispatch(this.setLoading(true));
        //     // }
        //     // this.loading = true;
        //
        //     console.log('%c____ProtectedElement_____', 'color: #22af2c', '______PAGE NOT READY________');
        //     // return null;
        //     //
        //     // if (redirectTo !== null) {
        //     //     return null;
        //     // }
        // }

        if (!lazy && this.loading) {
            this.waitUntil = true;
        }

        useLayoutEffect(() => {
            if (this.loading && this.restart === 'AUTH' && redirectTo && !this.isPageLoaded(redirectTo)) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'useLayoutEffect', 'SET-LOADING', { $AppState: this.$AppState, pathname });
                dispatch(this.setLoading(true));
            }
        }, [ isPageReady, dispatch, pathname, redirectTo ]);

        if (redirectTo && this.restart === 'AUTH') {
            console.log('%c____ProtectedElement_____', 'color: #22af2c', 'redirecting', { $AppState: this.$AppState });

            if (!this.pageOptionsMap[redirectTo]) {
                this.updateBasePageOptions(redirectTo, searchParams);
            }
            const { waitUntil } = this.getPageOption(redirectTo, 'onNavigate') || {};
            if (!this.loading && waitUntil && !this.isPageLoaded(redirectTo)/*&& this.isPageFirstRender*/) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'PRE_SET-LOADING');
                this.loading = true;
            }

            this.redirectionContext = {
                redirectTo,
                from: pathname,
                type: 'AUTH',
                isPageLoaded: this.isPageLoaded(redirectTo)
            };
            dispatch(this.setShowRedirectionModal(true));

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
                    { this.loading ? (
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
                { this.loading ? (
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

//! NO_AUTH +$
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
        //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=2, MODAL=1
        //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
        //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=2, MODAL=1
        //* }

//! AUTH +$
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
        //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=2, MODAL=1
        //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
        //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
        //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: 0,
            //* ____RedirectModal_____: NULL=3, MODAL=1
        //* }

//! LOGIN +$
    //! REDIRECT
        //? FIRST_RENDER +
            //? NO_WAIT(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: SUSPENSE=1,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
            //? WAIT_AUTH(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: LOADING=3, SUSPENSE=1,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
        //? NOT_FIRST_RENDER +
            //? NO_WAIT(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: 0,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
            //? WAIT_AUTH(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: 0,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //! NO_REDIRECT
        //* NOT_RENDERING

//! LOGOUT +$
    //! REDIRECT
        //? FIRST_RENDER +
            //? NO_WAIT(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: SUSPENSE=1,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
            //? WAIT_AUTH(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: LOADING=3, SUSPENSE=1,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
        //? NOT_FIRST_RENDER +
            //? NO_WAIT(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: 0,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
            //? WAIT_AUTH(LAZY) +
            //* {
                //* ____usePageStateSetUp____: 1,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: 0,
                //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //! NO_REDIRECT
        //* NOT_RENDERING

//! AUTH_EXPIRED
    // ! REDIRECT
        //? FIRST_RENDER
            // ? NO_WAIT(LAZY)
        //? NOT_FIRST_RENDER

