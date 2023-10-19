import {
    createContext,
    type FC,
    type PropsWithChildren, Suspense, useCallback, useContext,
    useEffect, useLayoutEffect, useRef,
    useState, useTransition
} from 'react';
import {
    createAsyncThunk,
    createAction,
    createReducer,
    type ActionCreatorWithPayload,
    type Reducer, type ThunkDispatch, type AnyAction, createSelector,
} from '@reduxjs/toolkit';
import {
    Navigate, useLocation, useNavigate, useSearchParams
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from 'components/PageLoader/PageLoader';
import { useAppSelector } from 'shared/hooks/redux';

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
    type TCb, type TMode, type TStateSetup
} from '../types';


class StateSetup {
    private readonly basePageOptions: IPageOptions = {
        actions: [],
        authRequirement: null,
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;
    private readonly authProtectionConfig: IAuthProtection;
    private readonly navigateOptions: Exclude<IPageOptions['onNavigate'], undefined>;

    private isAuth: boolean | null = null;
    private initiated: boolean = false;
    private redirectTo: null | string = null;
    private isPageFirstRender = true;
    private loading: boolean = false;
    private waitUntil = false; //* for not lazy loaded components
    private restart: boolean = false;
    private prevRoute: {
        pathname: string;
        mustDestroy: boolean;
        redirectedFrom?: string;
    } | null = null;
    private pageOptionsMap: Record<string, IPageOptions> = {};
    private asyncReducer: TAsyncReducer | null = null;

    private reducer!: Reducer;
    private setIsAuthenticated!: TSetIsAuthenticated;
    private setIsAppReady!: ActionCreatorWithPayload<boolean>;
    private setLoading!: ActionCreatorWithPayload<boolean>;
    private setIsPageReady!: ActionCreatorWithPayload<boolean>;

    constructor(
        getStateSetupConfig: TStateSetupFn,
        checkAuthorization: TCheckAuthorizationFn,
        {
            appReducerName,
            authProtectionConfig = {
                unAuthorized: './login',
                authorized: './'
            },
            navigateOptions = { waitUntil: 'CHECK_AUTH' },
        }: IOptionsParameter
    ) {
        console.log('StateSetup::__constructor__', { getStateSetupConfig, options: { appReducerName, authProtectionConfig } });
        this.getStateSetupConfig = getStateSetupConfig as TGetStateSetupConfig;
        this.authProtectionConfig = authProtectionConfig;
        this.navigateOptions = navigateOptions;
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
            redirectRef,
            mode,
        },
        thunkAPI
    ) => {
        try {
            const isAuth = await checkAuthorization({ isAuth: this.isAuth }, thunkAPI);

            if (typeof isAuth === 'boolean') {
                if (this.isAuth && isAuth !== this.isAuth) {
                    console.log(111111111);
                    this.restart = true;
                }
                this.isAuth = isAuth;
                thunkAPI.dispatch(this.setIsAuthenticated(isAuth));
            } else {
                throw new Error('checkAuthorization');
            }

            // this.updateBasePageOptions(pathname, searchParams);
            const redirectTo = this.getRedirectTo(pathname);
            if (redirectTo) {
                this.updateBasePageOptions(redirectTo, searchParams);
            }
            if (redirectRef) {
                redirectRef.current = redirectTo;
            }

            const { waitUntil } = this.getPageOption(redirectTo || pathname, 'onNavigate') || {};

            return thunkAPI.fulfillWithValue({
                redirectTo, mode, waitUntil: waitUntil || null
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
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isAppReady: false,
            isPageReady: false,
            isAuthenticated: false,
            loadingCount: 0,
            loading: false
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
                        if (this.restart) {
                            state.isPageReady = false;
                            this.redirectTo = redirectTo;
                            console.log(66666666666);
                        } else {
                            console.log(77777);
                            if (this.waitUntil) {
                                this.waitUntil = false;
                                this.loading = false;
                                state.loading = false;
                                state.loadingCount = state.loadingCount + 0.5;
                            }
                            state.isAppReady = true;

                            if (redirectTo === null) {
                                state.isPageReady = true;

                                if (waitUntil === 'CHECK_AUTH') {
                                    this.isPageFirstRender = false;
                                }
                            } else {
                                this.redirectTo = redirectTo;
                                state.isPageReady = true;

                                if (waitUntil === 'CHECK_AUTH') {
                                    this.isPageFirstRender = false;
                                }
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
                        this.isPageFirstRender = false;
                        // state.loading = false;
                        console.log('__________FIRST RENDER____________', {
                            isPageFirstRender: this.isPageFirstRender,
                            restart: this.restart,
                        });
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
                    if (state.isAppReady && state.isAuthenticated && !payload.isAuthenticated) {
                        state.isPageReady = null;
                    } //?
                    state.isAuthenticated = payload.isAuthenticated;
                    this.isAuth = state.isAuthenticated;
                    if (payload.restart) {
                        const redirectTo = this.getRedirectTo(this.prevRoute!.pathname);
                        console.log('RESTART::this.setIsAuthenticated', {
                            redirectTo,
                            prevRoute: this.prevRoute
                        });
                        if (redirectTo) {
                            this.restart = true;
                            state.isPageReady = false;
                        }
                        // const destroyPath = payload.isAuthenticated
                        //     ? this.authProtectionConfig.authorized
                        //     : this.authProtectionConfig.unAuthorized;
                        // console.log(333, {
                        //     destroyPath, 'this.prevRoute': this.prevRoute, aa: this.pageOptionsMap[destroyPath]
                        // });
                        // this.prevRoute?.pathname !== destroyPath
                        //     && this.isPageLoaded(destroyPath)
                        //     && delete this.pageOptionsMap[destroyPath];
                        // this.prevRoute = null;

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

    private isPageLoaded = (pathname: string) => Boolean(this.pageOptionsMap[pathname]);
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
                console.log('setUp::finally');
            }
        }
    );

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
        const redirectRef = useRef<null | string>(null);

        console.log('%c______usePageStateSetUp______', 'color: #ae54bf', '::START', {
            pathname,
            from: state?.from,
            isPageFirstRender: this.isPageFirstRender,
            prevRoute: this.prevRoute,
            isAuth: this.isAuth,
            restart: this.restart,
            'this.redirectTo': this.redirectTo,
            redirectRef: { ...redirectRef }
        });

        if (!this.isPageLoaded(pathname)) {
            this.isPageFirstRender = true;
            this.updateBasePageOptions(pathname, searchParams);
        } else if (this.restart && this.isPageFirstRender) {
            this.isPageFirstRender = false;
        }
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const redirectTo = this.getRedirectTo(pathname);
        if (redirectTo) {
            if (!this.isPageLoaded(redirectTo)) {
                this.isPageFirstRender = true;
                this.updateBasePageOptions(redirectTo, searchParams);
            }
        }
        const mustRedirect = redirectTo && Boolean(this.prevRoute);

        if (
            this.isPageFirstRender
            // && !mustRedirect
            && this.prevRoute?.pathname !== redirectTo
            && !this.loading
            && waitUntil
            && !state?.from
            // && !this.prevRoute?.redirectedFrom
        ) {
            this.loading = true;
            console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'PRE-SET_LOADING');
        }

        if (this.prevRoute && this.prevRoute.pathname !== pathname) {
            this.prevRoute.mustDestroy = true;
            console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'mustDestroy', this.prevRoute);
        }

        // if (this.restart /*&& state?.from*/) {
        //     this.redirectTo = pathname;
        // }
        // if (state?.from && this.prevRoute) {
        //     this.prevRoute.redirectedFrom = this.prevRoute.pathname;
        //     this.prevRoute.pathname = state.from;
        // }

        useLayoutEffect(() => {
            if (mustRedirect) {
                console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'useLayoutEffect', 'REDIRECT');

                navigate(redirectTo, { state: { from: pathname } });
                // this.prevRoute!.pathname = pathname;
                // delete this.prevRoute!.redirectedFrom;
            }
            if (this.loading && !this.redirectTo && !state?.from) {
                console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'useLayoutEffect', 'SET_LOADING');
                dispatch(this.setLoading(true));
            }
        });

        useEffect(() => {
            if (!this.redirectTo) {
                if (!state?.from || this.restart) {
                    const mustCheckAuth = this.isAuth === null || this.isAuth;

                    if (mustCheckAuth) {
                        console.log('%c______usePageStateSetUp______', 'color: #ae54bf', '============CheckAuth=============');

                        checkAuth({
                            pathname, searchParams, redirectRef, mode: 'APP'
                        }).then((result) => {
                            if (this.checkAuthorization.fulfilled.match(result) && waitUntil/* && result.payload.waitUntil === 'SETUP'*/) {
                                console.log('%c______usePageStateSetUp______', 'color: #ae54bf', '============SetUp>>>CheckAuth=============');

                                console.log(
                                    '%c______usePageStateSetUp______', 'color: #ae54bf',
                                    {
                                        pathname,
                                        navigateTo: redirectRef.current,
                                        // isAppReady,
                                        result
                                    }
                                );
                                setup({
                                    mode: 'APP',
                                    pathname: result.payload.redirectTo || pathname,
                                    asyncReducer
                                });

                                if (result.payload.redirectTo && !mustRedirect) {
                                    console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'REDIRECT');
                                    navigate(result.payload.redirectTo, { state: { from: pathname } });
                                }
                            }
                        });
                    }
                    if (!waitUntil || !mustCheckAuth) {
                        console.log('%c______usePageStateSetUp______', 'color: #ae54bf', '============SetUp=============');
                        setup({
                            mode: 'APP',
                            pathname: redirectTo || pathname,
                            asyncReducer
                        });
                    }
                }
            } else {
                console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'CLEAN_REDIRECTION');
                this.redirectTo = null;
            }

            if (this.restart) {
                this.restart = false;
            }

            if (state?.from /*|| this.redirectTo*/) {
                console.log('%c______usePageStateSetUp______', 'color: #ae54bf', 'CLEAN_STATE>FROM');

                window.history.replaceState({}, document.title);
                // this.redirectTo = null;
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        });
        console.log('%c______usePageStateSetUp______', 'color: #ae54bf', '::END', {
            redirectTo,
            waitUntil,
            pathname,
            from: state?.from,
            isPageFirstRender: this.isPageFirstRender,
            prevRoute: this.prevRoute,
            isAuth: this.isAuth,
            restart: this.restart,
            'this.redirectTo': this.redirectTo,
            redirectRef: { ...redirectRef },
        });
        return {
            redirectTo: !this.prevRoute && this.redirectTo,
            pathname,
            from: state?.from || null
        };
    };

    public getLoading = (type?: 'SUSPENSE', waitUntil?: Exclude<IPageOptions['onNavigate'], undefined>['waitUntil']) => createSelector(
        ({ app }: IStateSchema) => app.loadingCount,
        (loadingCount) => {
            let loading = false;

            if (type === 'SUSPENSE' && !waitUntil && !this.loading) {
                loading = true;
            } else if (!type /*&& this.isPageFirstRender */&& this.loading /*&& waitUntil*/) {
                loading = true;
            }

            console.log('$$$getLoading$$$', {
                type,
                waitUntil,
                loadingCount,
                loading,
                isPageFirstRender: this.isPageFirstRender,
                'THIS:loading': this.loading
            });
            return loading;
        });
    public Loader = ({ type, pathname }: {type?: 'SUSPENSE'; pathname: string}) => {
        const dispatch = useDispatch();
        const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
        const loading = useSelector(this.getLoading(type, waitUntil));

        useEffect(() => {
            console.log('%c____LLLLLLLLLLLLLLLLLLLLL_____', 'color: #dbd518', 'UPDATE', {
                type,
                waitUntil,
                'this.loading': this.loading,
                loading,
            });
        });

        useLayoutEffect(() => {
            if (type === 'SUSPENSE' && loading) {
                console.log('%c____LLLLLLLLLLLLLLLLLLLLL_____', 'color: #dbd518', 'useLayoutEffect');
                dispatch(this.setLoading(true));
            }

            return () => {
                console.log('%c____LLLLLLLLLLLLLLLLLLLLL_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', {
                    type,
                    loading,
                    'this.loading': this.loading
                });

                if (type === 'SUSPENSE') {
                    console.log('%c____LLLLLLLLLLLLLLLLLLLLL_____', 'color: #dbd518', 'useLayoutEffect', 'UNMOUNT', '+++Clear+++');
                    this.isPageFirstRender = false;
                    this.loading = false;
                    dispatch(this.setLoading(false));
                }
            };
        }, [ loading, dispatch, type ]);

        console.log('%c____LLLLLLLLLLLLLLLLLLLLL_____', 'color: #dbd518', type || 'LOADING', {
            'this.loading': this.loading,
            loading
        });

        return loading ? <PageLoader /> : null;
    };

    public getIsPageReady = (pathname: string) => createSelector(
        ({ app }: IStateSchema) => app.isPageReady,
        (isPageReady) => {
            const { waitUntil } = this.getPageOption(pathname, 'onNavigate') || {};
            if (!waitUntil) {
                return true;
            }
            return ((isPageReady || (!this.isPageFirstRender && !this.restart))
                && (pathname === this.redirectTo || this.redirectTo === null));
        });

    public ProtectedElement: FC<PropsWithChildren<{ pathname: string }>> = ({
        children,
        pathname,
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
            prevRoute: this.prevRoute,
            isPageFirstRender: this.isPageFirstRender,
            isPageReady,
            initiated: this.initiated,
            restart: this.restart,
            'this.redirectTo': this.redirectTo,
            loading: this.loading,
            isAuth: this.isAuth,
        });

        const redirectTo = this.getRedirectTo(pathname);
        const { waitUntil } = this.getPageOption(this.redirectTo || pathname, 'onNavigate') || {};
        if (waitUntil === 'SETUP') {
            shouldRerender.current = true;
        }


        useEffect(() => {
            console.log('%c____ProtectedElement_____: UPDATE', 'color: #22af2c', {
                pathname,
                prevRoute: this.prevRoute,
                isPageReady,
                initiated: this.initiated,
                restart: this.restart,
                redirectTo: this.redirectTo,
            });
        });

        if (
            // (!isPageLoaded && waitUntil) || //! first load scenario
            // (/*isPageReady &&*/ redirectTo !== null) || //! redirection scenario
            // (/*isPageReady === null &&*/ !this.restart) || //! restart scenario
            (
                (
                    // this.prevRoute?.redirectedFrom ||
                    this.initiated
                ) && waitUntil === 'SETUP'
            )
        ) {
            // if (!this.loading) {
            //     dispatch(this.setLoading(true));
            // }
            // this.loading = true;

            console.log('%c____ProtectedElement_____', 'color: #22af2c', '______PAGE NOT READY________');
            // return null;
            //
            // if (redirectTo !== null) {
            //     return null;
            // }
        } else {
            // console.log(666666);
        }

        if (!lazy && this.loading) {
            this.waitUntil = true;
        }

        useLayoutEffect(() => {
            if (this.loading && this.restart && this.isPageFirstRender) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'useLayoutEffect', 'SET-LOADING');
                dispatch(this.setLoading(true));
            }
        }, [ isPageReady, dispatch ]);


        const Loader = this.Loader;
        if (redirectTo && this.restart) {
            console.log('%c____ProtectedElement_____', 'color: #22af2c', 'redirecting', { isPageFirstRender: this.isPageFirstRender, loading: this.loading });

            if (!this.isPageLoaded(redirectTo)) {
                this.isPageFirstRender = true;
                this.updateBasePageOptions(redirectTo, searchParams);
            }
            const { waitUntil } = this.getPageOption(redirectTo, 'onNavigate') || {};
            if (!this.loading && this.isPageFirstRender) {
                console.log('%c____ProtectedElement_____', 'color: #22af2c', 'PRE_SET-LOADING');
                this.loading = true;
            }

            console.log('%c____ProtectedElement_____', 'color: #22af2c', '::END', {
                lazy,
                pathname,
                prevRoute: this.prevRoute,
                isPageFirstRender: this.isPageFirstRender,
                isPageReady,
                initiated: this.initiated,
                restart: this.restart,
                'this.redirectTo': this.redirectTo,
                loading: this.loading,
                isAuth: this.isAuth,
                waitUntil,
                redirectTo
            });
            return (
                <>
                    { this.loading ? <Loader pathname={ pathname } /> : children }
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
            prevRoute: this.prevRoute,
            isPageFirstRender: this.isPageFirstRender,
            isPageReady,
            initiated: this.initiated,
            restart: this.restart,
            'this.redirectTo': this.redirectTo,
            loading: this.loading,
            isAuth: this.isAuth,
            waitUntil,
            redirectTo
        });
        return (
            <>
                { this.loading ? <Loader pathname={ pathname } /> : null }
                {
                    isPageReady && !redirectTo
                        ? (
                                !lazy && !waitUntil ?
                                    children : (
                                        <Suspense fallback={ (
                                            <Loader
                                                type={ 'SUSPENSE' }
                                                pathname={ pathname }
                                            />
                                        ) }
                                        >
                                            { /*<EmptyComponent>*/ }
                                            { children }
                                            { /*</EmptyComponent>*/ }
                                        </Suspense>
                                    ) /*(
                                    <EmptyComponent>
                                        { children }
                                    </EmptyComponent>
                                )*/
                            )
                        : null
                }
            </>
        );
    };

    public getStoreReducer() {
        return this.reducer;
    }
    public getStoreCreatorsActions() {
        return {
            ProtectedElement: this.ProtectedElement,
            Loader: this.Loader,
            actionCreators: {
                setIsAuthenticated: this.setIsAuthenticated,
                setLoading: this.setLoading,
            },
            usePageStateSetup: this.usePageStateSetup,
        };
    }
}
export default StateSetup;
