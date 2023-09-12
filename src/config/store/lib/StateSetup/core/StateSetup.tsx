import {
    type ActionCreatorWithPayload,
    type Reducer,
    createAsyncThunk,
    createAction,
    createReducer
} from '@reduxjs/toolkit';
import { Navigate, useSearchParams } from 'react-router-dom';
import { type FC, type PropsWithChildren } from 'react';

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
    type TDispatch
} from '../types';



class StateSetup {
    private readonly basePageOptions: IPageOptions = {
        actions: [],
        authRequirement: null,
    };
    private readonly authProtection: IAuthProtection;
    private readonly getStateSetupConfig: TGetStateSetupConfig;
    private readonly checkAuthorization: TCheckAuthorizationAsyncThunk;

    private isAuth: boolean | null = null;
    private pageOptionsMap: Record<string, IPageOptions> = {};

    private setIsAuthenticated!: TSetIsAuthenticated;
    private setIsAppReady!: ActionCreatorWithPayload<boolean>;
    private reducer!: Reducer;

    constructor(
        getStateSetupConfig: TStateSetupFn,
        checkAuthorization: TCheckAuthorizationFn,
        {
            appReducerName,
            authProtection = {
                unAuthorized: './login',
                authorized: './'
            }
        }: IOptionsParameter
    ) {
        console.log('StateSetup::__constructor__', { getStateSetupConfig, options: { appReducerName, authProtection } });
        this.getStateSetupConfig = getStateSetupConfig as TGetStateSetupConfig;
        this.checkAuthorization = createAsyncThunk('@@INIT:Authorization', checkAuthorization);
        this.generateActions(appReducerName);
        this.generateReducer();
        this.authProtection = authProtection;
    }

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
            (payload: boolean) => ({ payload })
        );
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isAppReady: false,
            isAuthenticated: false,
            isReducersReady: false,
        }, (builder) => {
            builder
                .addCase(this.setup.fulfilled, (state, { payload: isAppReady }) => {
                    state.isAppReady = Boolean(isAppReady);
                })
                .addCase(this.setIsAuthenticated, (
                    state,
                    { payload }
                ) => {
                    state.isAuthenticated = payload.isAuthenticated;
                    if (payload.restart) state.isAppReady = false;
                })
                .addCase(this.setIsAppReady, (state, { payload }) => {
                    state.isAppReady = payload;
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

    private getPageOption(pathname: string) {
        const { actions } = this.pageOptionsMap[pathname];

        return actions;
    }

    private async callActions(
        actions: IPageOptions['actions'],
        dispatch: TDispatch,
        state: IStateSchema
    ) {
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const isAsync = action.async;

            if (typeof action.canRefetch === 'function') {
                action.canRefetch = action.canRefetch(state);
            }

            if (!action._fetched) {
                if (isAsync) {
                    await (dispatch(action.cb()));
                } else {
                    dispatch(action.cb());
                }
            }

            if (!action.canRefetch) {
                action._fetched = true;
            }
        }
    }

    private getRedirectTo(pathname: string) {
        const { authRequirement } = this.pageOptionsMap[pathname];

        let redirectTo = null;

        if (authRequirement !== null) {
            redirectTo = authRequirement
                ? (!this.isAuth
                        ? this.authProtection.unAuthorized
                        : null)
                : (this.isAuth
                        ? this.authProtection.authorized
                        : null);
        }

        return redirectTo;
    };

    private setup = createAsyncThunk<
        boolean | null,
        TStateSetUpArgs,
        IThunkConfig
    >(
        '@@INIT:STATE',
        async (
            {
                pathname,
                searchParams
            },
            {
                rejectWithValue,
                fulfillWithValue,
                getState,
                dispatch
            }
        ) => {
            try {
                console.info({
                    pathname, isAppReady: getState().app.isAppReady, state: getState()
                }, 'setUp::start');
                this.updateBasePageOptions(pathname, searchParams);
                await dispatch(this.checkAuthorization({
                    isAuth: this.isAuth,
                    setIsAuthenticated: this.setIsAuthenticated
                }));
                this.isAuth = getState().app.isAuthenticated;

                const actions = this.getPageOption(pathname);
                // if (redirectTo) {
                //     //await dispatch(this.setRestart());
                //     // console.log('________________');
                //     navigate?.(redirectTo, { state: { from: pathname } });
                //     dispatch(this.setup({
                //         redirectedFrom: pathname,
                //         pathname: redirectTo,
                //         searchParams
                //     }));
                //
                //     console.info({
                //         pathname, redirectTo, isAppReady: getState().app.isAppReady, state: getState()
                //     }, 'setUp::redirected');
                //     return fulfillWithValue(false);
                // }

                await this.callActions(actions, dispatch, getState());

                console.info({
                    pathname, isAppReady: getState().app.isAppReady, state: getState()
                }, 'setUp::end');
                return fulfillWithValue(true);
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
        const [ searchParams ] = useSearchParams();
        this.updateBasePageOptions(pathname, searchParams);

        const redirectTo = this.getRedirectTo(pathname);

        return !redirectTo ? children : (
            <Navigate
                to={ redirectTo }
                state={{ from: pathname }}
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
                setIsAuthenticated: this.setIsAuthenticated,
                setIsAppReady: this.setIsAppReady,
            },
            $stateSetup: this.setup,
        };
    }
}
export default StateSetup;
