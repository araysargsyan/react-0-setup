import {
    type FC,
    type PropsWithChildren,
    useEffect
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
    type TCb
} from '../types';


class StateSetup {
    private readonly basePageOptions: IPageOptions = {
        actions: [],
        authRequirement: null,
    };
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly authProtectionConfig: IAuthProtection;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;

    private isAuth: boolean | null = null;
    private prevRoute: {
        pathname: string;
        mustDestroy: boolean;
    } | null = null;
    private pageOptionsMap: Record<string, IPageOptions> = {};
    private asyncReducer: TAsyncReducer | null = null;

    private reducer!: Reducer;
    private setIsAuthenticated!: TSetIsAuthenticated;
    private setIsAppReady!: ActionCreatorWithPayload<boolean | string | null>;
    private setIsPageReady!: ActionCreatorWithPayload<boolean | null>;

    constructor(
        getStateSetupConfig: TStateSetupFn,
        checkAuthorization: TCheckAuthorizationFn,
        {
            appReducerName,
            authProtectionConfig = {
                unAuthorized: './login',
                authorized: './'
            }
        }: IOptionsParameter
    ) {
        console.log('StateSetup::__constructor__', { getStateSetupConfig, options: { appReducerName, authProtectionConfig } });
        this.getStateSetupConfig = getStateSetupConfig as TGetStateSetupConfig;
        this.authProtectionConfig = authProtectionConfig;
        this.checkAuthorization = createAsyncThunk<
            TCheckAuthorizationReturn,
            Parameters<TCheckAuthorizationAsyncThunk>[0],
            IThunkConfig
        >(
            '@@INIT:Authorization',
            async (args, thunkAPI) => {
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
            restart = true
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

            return thunkAPI.fulfillWithValue({ redirectTo, restart });
        } catch (e) {
            return thunkAPI.rejectWithValue('error');
        }
    };
    private generateActions(appReducerName: string) {
        this.setIsAuthenticated = createAction(
            `${appReducerName}/setIsAuthenticated`,
            (isAuthenticated: boolean, restart: boolean = true) =>({
                payload: {
                    isAuthenticated,
                    restart
                },

            })
        );
        this.setIsAppReady = createAction(
            `${appReducerName}/setIsAppReady`,
            (payload: boolean | string | null) => ({ payload })
        );
        this.setIsPageReady = createAction(
            `${appReducerName}/setIsPageReady`,
            (payload: boolean | null) => ({ payload })
        );
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isPageReady: null,
            isAppReady: null,
            isAuthenticated: false,
            isReducersReady: false,
        }, (builder) => {
            builder
                .addCase(this.checkAuthorization.fulfilled, (
                    state,
                    { payload: { redirectTo, restart } }
                ) => {
                    if (restart) {
                        state.isAppReady = redirectTo === null ? false : redirectTo;
                    } else if (redirectTo === null) {
                        state.isPageReady = true;
                    }
                })
                .addCase(this.setup.fulfilled, (state, { payload: { isAppReady, restart } }) => {
                    if (restart) {
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
                    // if (payload.restart) state.isAppReady = false;
                })
                .addCase(this.setIsAppReady, (state, { payload }) => {
                    state.isAppReady = payload;
                })
                .addCase(this.setIsPageReady, (state, { payload }) => {
                    if (this.isAuth !== false) {
                        state.isPageReady = payload;
                    }
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
        dispatch: TDispatch
    ) {
        let actionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1] = null;
        const call = async (options: unknown[])=> {
            if (method === 'add') {
                await this.asyncReducer!.add(dispatch, options);
            } else {
                await this.asyncReducer!.remove(dispatch, options);
            }
        };

        if (asyncReducerOptions) {
            if (typeof asyncReducerOptions === 'function') {
                const [ options, actionCreators ] = await asyncReducerOptions();

                if (method === 'add') {
                    actionCreatorsOption = actionCreators;
                }
                await call(options);
            } else {
                await call(asyncReducerOptions);
            }
        }

        return actionCreatorsOption;
    }
    private async callActions(
        actions: IPageOptions['actions'],
        dispatch: TDispatch,
        state: IStateSchema,
        extraActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1]
    ) {
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const isAsync = action.async;

            if (typeof action.canRefetch === 'function') {
                action.canRefetch = action.canRefetch(state);
            }

            if (!action._fetched) {
                if (isAsync) {
                    if (extraActionCreatorsOption && typeof action.cb === 'object' && extraActionCreatorsOption[action.cb.key]) {
                        const cb = action.cb.getAction(extraActionCreatorsOption[action.cb.key]);
                        await (dispatch(cb()));
                    } else {
                        await dispatch((action.cb as TCb)());
                    }
                } else {
                    if (extraActionCreatorsOption && typeof action.cb === 'object' && extraActionCreatorsOption[action.cb.key]) {
                        const cb = action.cb.getAction(extraActionCreatorsOption[action.cb.key]);
                        dispatch(cb());
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
        { isAppReady: boolean | null; restart: boolean },
        TStateSetUpArgs,
        IThunkConfig
    >(
        '@@INIT:STATE',
        async (
            {
                pathname,
                restart = true,
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
                let extraActionCreatorsOption: Awaited<ReturnType<TAsyncReducersOptions>>[1] = null;
                console.info({
                    pathname,
                    isAppReady: getState().app.isAppReady,
                    restart,
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
                            await this.callReducerManager('remove', asyncReducerOptions, dispatch);
                        }

                        extraActionCreatorsOption = await this.callReducerManager('add', asyncReducerOptions, dispatch);
                    }

                    if (asyncReducerOptions && !extraActionCreatorsOption) {
                        extraActionCreatorsOption = (await asyncReducerOptions())[1];
                    }
                }
                
                const actions = this.getPageOption(pathname, 'actions');
                await this.callActions(actions, dispatch, getState(), extraActionCreatorsOption);

                console.info({
                    pathname, isAppReady:
                    getState().app.isAppReady,
                    restart,
                    state: getState()
                }, 'setUp::end');
                this.prevRoute = {
                    pathname,
                    mustDestroy: false
                };
                return fulfillWithValue({ isAppReady: true, restart });
            } catch (err) {
                console.error('setUp::catch', err);
                return rejectWithValue('Something went wrong!');
            } finally {
                console.log({ historyState: window.history.state.usr }, 'setUp::finally');
            }
        }
    );

    public ProtectedElement: FC<PropsWithChildren<{ pathname: string }>> = ({
        children,
        pathname
    }) => {
        const isPageReady = useSelector(({ app }: IStateSchema) => app.isPageReady);
        const dispatch = useDispatch<TDispatch>();
        const [ searchParams ] = useSearchParams();

        useEffect(() => {
            console.log('____ProtectedElement_____', {
                pathname, prevRoute: this.prevRoute, isPageReady 
            });
            if (isPageReady === null) {
                if (this.isAuth !== false) {
                    dispatch(this.checkAuthorization({
                        pathname, searchParams, restart: false
                    })).then((result) => {
                        if (this.checkAuthorization.fulfilled.match(result)) {
                            const path = result.payload.redirectTo || pathname;

                            this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;

                            dispatch(this.setup({
                                pathname: path,
                                restart: false,
                            }));
                        }
                    });
                } else {
                    this.updateBasePageOptions(pathname, searchParams);
                    const path = this.getRedirectTo(pathname) || pathname;

                    this.prevRoute!.mustDestroy = this.prevRoute !== null && this.prevRoute.pathname !== path;

                    dispatch(this.setup({
                        pathname: path,
                        restart: false,
                    }));
                }
            }
        });

        if (isPageReady === null) {
            return <h1>PAGE NOT READY</h1>;
        }

        this.updateBasePageOptions(pathname, searchParams);
        const redirectTo = this.getRedirectTo(pathname);

        return !redirectTo ? children : (
            <Navigate
                to={ redirectTo }
                //state={{ from: pathname, redirected: true }}
            />
        );
    };
    public getStoreReducer() {
        return this.reducer;
    }
    public getStoreCreatorsActions() {
        return {
            ProtectedElement: this.ProtectedElement,
            actionCreators: {
                checkAuthorization: this.checkAuthorization,
                setIsAuthenticated: this.setIsAuthenticated,
                setIsAppReady: this.setIsAppReady,
                setIsPageReady: this.setIsPageReady,
            },
            $stateSetup: this.setup,
        };
    }
}
export default StateSetup;
