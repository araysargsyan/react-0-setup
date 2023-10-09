import {
    type FC,
    type PropsWithChildren,
    useEffect, useRef,
    useState
} from 'react';
import {
    createAsyncThunk,
    createAction,
    createReducer,
    type ActionCreatorWithPayload,
    type Reducer,
} from '@reduxjs/toolkit';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Portal from 'shared/ui/Portal';
import Modal from 'shared/ui/Modal';

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
    type TCb, type TMode
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
                this.isAuth = isAuth;
                thunkAPI.dispatch(this.setIsAuthenticated(isAuth));
            } else {
                throw new Error('checkAuthorization');
            }

            this.updateBasePageOptions(pathname, searchParams);
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
            loading: false,
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
                        if (redirectTo === null) {
                            state.isAppReady = true;

                            if (waitUntil === 'CHECK_AUTH') {
                                state.isPageReady = true;
                                // state.loading = false;
                            }
                            // if (!waitUntil) {
                            //     state.loading = false;
                            // }
                        } else {
                            console.log(6666, this.initiated);
                            this.redirectTo = redirectTo;
                            state.isAppReady = true;
                            if (waitUntil === 'CHECK_AUTH') {
                                state.isPageReady = true;
                                // state.loading = false;
                            }
                            // if (!waitUntil) {
                            //     state.loading = false;
                            // }
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
                        // if (this.redirectTo === null) {
                        //     this.redirectTo = '';
                        // }
                        // state.loading = false;
                        console.log('__________FIRST RENDER____________');
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
                    }
                    if (payload.restart) {
                        this.restart = true;
                        state.isPageReady = null;
                    }
                    state.isAuthenticated = payload.isAuthenticated;
                    this.isAuth = state.isAuthenticated;
                })
                .addCase(this.setIsAppReady, (state, { payload }) => {
                    state.isAppReady = payload;
                })
                .addCase(this.setLoading, (state, { payload }) => {
                    state.loading = payload;
                    //
                    // if (!state.loading && payload) {
                    //     state.loading = payload;
                    // } else if (!payload) {
                    //     state.loading = payload;
                    // }
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

    public ProtectedElement: FC<PropsWithChildren<{ pathname: string }>> = ({
        children,
        pathname
    }) => {
        const isPageReady = useSelector(({ app }: IStateSchema) => app.isPageReady);
        const [ isReady, setIsReady ] = useState(false);
        const shouldRerender = useRef(false);
        const bbbb = useRef(false);
        const isModalShow = useRef(false);
        const dispatch = useDispatch<TDispatch>();
        const [ searchParams ] = useSearchParams();

        useEffect(() => {
            console.log('%c____ProtectedElement_____: START', 'color: #22af2c', {
                pathname,
                prevRoute: this.prevRoute,
                isPageReady,
                initiated: this.initiated,
                restart: this.restart,
                redirectTo: this.redirectTo,
            });
            if (bbbb.current) {
                bbbb.current = false;
                dispatch(this.setLoading(true));
            }

            if (
                this.redirectTo === null && this.initiated && (
                    isPageReady
                    || (this.restart && !isPageReady)
                )
            ) {
                if (this.prevRoute?.redirectedFrom) {
                    this.initiated = false;
                }
                console.log('%c____ProtectedElement_____: checkAuth & setup', 'color: #ea4566');
                if (this.isAuth !== false) { //! <AUTH> check auth then get redirectTo and call setup
                    dispatch(this.checkAuthorization({
                        mode: 'PAGE',
                        pathname: this.prevRoute?.redirectedFrom || pathname,
                        searchParams
                    })).then((result) => {
                        if (this.checkAuthorization.fulfilled.match(result)) {
                            const redirectTo = result.payload.redirectTo;
                            const path = this.prevRoute?.redirectedFrom || redirectTo || pathname;
                            this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;
                            console.log(6666, {
                                pathname, redirectTo, path,
                                prevRoute: this.prevRoute,
                                restart: this.restart,
                            });
                            dispatch(this.setup({
                                pathname: path,
                                mode: 'PAGE',
                            })).then((_) => {
                                //this.initiated = false;

                                if (this.prevRoute?.redirectedFrom) {
                                    delete this.prevRoute?.redirectedFrom;
                                }
                                if (result.payload.waitUntil === 'SETUP') {
                                    console.log(666666666);
                                    setIsReady(!isReady);
                                }
                            });
                        }
                    });
                } else { //! <NOT_AUTH> get redirectTo and call setup
                    this.updateBasePageOptions(pathname, searchParams);
                    const redirectTo = this.getRedirectTo(pathname);
                    const path = redirectTo || pathname;

                    this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;

                    dispatch(this.setup({
                        pathname: path,
                        mode: 'PAGE'
                    })).then((_) => {
                        if (shouldRerender.current) {
                            console.log('RERENDER', 777);
                            shouldRerender.current = false;
                            this.initiated = false;
                            setIsReady(!isReady);
                        }
                    });
                }
            } else if (isPageReady) {
                if (this.restart) {
                    this.restart = false;
                }
                if (this.redirectTo === pathname || this.redirectTo === null) {
                    window.history.replaceState({}, document.title);
                    dispatch(this.setLoading(false));
                    this.initiated = true;
                    this.redirectTo = null;
                }
            }

            console.log('%c____ProtectedElement_____: END', 'color: #22af2c', {
                pathname,
                prevRoute: this.prevRoute,
                isPageReady,
                initiated: this.initiated,
                restart: this.restart,
                redirectTo: this.redirectTo,
            });
        });


        this.updateBasePageOptions(pathname, searchParams);
        const redirectTo = this.getRedirectTo(pathname);
        if (redirectTo) {
            this.updateBasePageOptions(redirectTo, searchParams);
        }
        const { waitUntil } = this.getPageOption(this.redirectTo || pathname, 'onNavigate') || {};
        if (waitUntil === 'SETUP') {
            shouldRerender.current = true;
        }
        const authRequirement = this.getPageOption(this.redirectTo || pathname, 'authRequirement');

        if (redirectTo && this.prevRoute) {
            console.log('____ProtectedElement_____::redirecting');
            this.prevRoute.redirectedFrom = redirectTo;
            return (
                <Navigate
                    to={ redirectTo }
                />
            );
        }

        const aa = authRequirement !== null && this.isAuth !== null
            ? authRequirement === this.isAuth
            : null;

        console.log('___LAST___', {
            aa,
            authRequirement,
            isAuth: this.isAuth,
            isPageReady, prevRoute: this.prevRoute, initiated: this.initiated, waitUntil, pathname, redirectTo
        });

        if (
            (isPageReady === false && waitUntil) ||
            (redirectTo !== null && this.isAuth !== null) ||
            (isPageReady === null && !this.restart) ||
            (
                (
                    this.prevRoute?.redirectedFrom
                    || this.initiated
                ) && waitUntil === 'SETUP'
            )
        ) {
            bbbb.current = true;
            console.log('______PAGE NOT READY________');
            // if (isPageReady === false && waitUntil) {
            //     return null;
            // }
            return null;
            //return <h1>PAGE NOT READY</h1>;
        } /*else {
            dispatch(this.setLoading(false));
        }*/


        if (this.redirectTo && !this.initiated) {
            isModalShow.current = true;
        }

        return (
            <>
                { /*                <Portal>
                    <Aa
                        ml={ 3000 }
                        show={ isModalShow.current }
                    />
                </Portal>*/ }
                { children }
            </>
        );
    };
    public getStoreReducer() {
        return this.reducer;
    }
    public getStoreCreatorsActions() {
        return {
            ProtectedElement: this.ProtectedElement,
            actionCreators: { setIsAuthenticated: this.setIsAuthenticated, },
            $stateSetup: this.setup,
            $checkAuthorization: this.checkAuthorization,
        };
    }
}
export default StateSetup;
