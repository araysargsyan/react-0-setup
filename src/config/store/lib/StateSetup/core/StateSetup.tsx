import {
    type AnyAction,
    type ThunkDispatch,
    type ActionCreatorWithPayload,
    type ActionCreatorWithPreparedPayload,
    type Reducer,
    createAsyncThunk,
    createAction,
    createReducer
} from '@reduxjs/toolkit';
import {
    type IStateSchema, type IThunkConfig, type TStateSetupFn 
} from 'config/store';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { Navigate, useSearchParams } from 'react-router-dom';
import { type FC, type PropsWithChildren } from 'react';

import {
    type IAppSchema,
    type IAuthProtection,
    type IOptions,
    type IPageOptions,
    type TGetStateSetupConfig,
    type TStateSetUpArgs
} from '../types';



class StateSetup {
    private readonly basePageOptions: IPageOptions = {
        actions: [],
        authRequirement: null,
    };
    private readonly authProtection: IAuthProtection;
    private readonly getStateSetupConfig: TGetStateSetupConfig;

    private isAuth: boolean | null = null;
    private pageOptionsMap: Record<string, IPageOptions> = {};

    private setIsAuthenticated!: ActionCreatorWithPreparedPayload<
        [isAuthenticated: boolean, restart?: boolean],
        {isAuthenticated: boolean; restart: boolean}
    >;
    private setIsAppReady!: ActionCreatorWithPayload<boolean>;
    private setRestart!: any; //ActionCreatorWithoutPayload;
    private reducer!: Reducer;

    constructor(
        getStateSetupConfig: TStateSetupFn,
        {
            appReducerName,
            authProtection = {
                unAuthorized: './login',
                authorized: './'
            }
        }: IOptions
    ) {
        console.log('StateSetup::__constructor__', { getStateSetupConfig, options: { appReducerName, authProtection } });
        this.getStateSetupConfig = getStateSetupConfig as TGetStateSetupConfig;
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
        this.setRestart = createAsyncThunk(
            `${appReducerName}/setRestart`,
            async () => {}
        );
    }

    private generateReducer() {
        this.reducer = createReducer<IAppSchema>({
            isAppReady: false,
            isAuthenticated: false,
            isReducersReady: false,
            //isStarting: false
        }, (builder) => {
            builder
                .addCase(this.setup.fulfilled, (state, { payload: isAppReady }) => {
                    state.isAppReady = Boolean(isAppReady);
                })
                // .addCase(stateSetUp.fulfilled, (state, { payload }) => {
                //     payload.a();
                // })
                // .addCase(stateSetUp.pending, (state, { payload: isAppReady }) => {
                //     if (state.isAppReady) state.isAppReady = false;
                // })
                .addCase(this.setIsAuthenticated, (
                    state,
                    { payload }
                ) => {
                    state.isAuthenticated = payload.isAuthenticated;
                    if (payload.restart) state.isAppReady = false;
                })
                // .addCase(setReducersReady, (state, { payload }) => {
                //     state.isReducersReady = payload;
                // })
                .addCase(this.setIsAppReady, (state, { payload }) => {
                    state.isAppReady = payload;
                })
                .addCase(this.setRestart.pending, (state) => {
                    // state.isStarting = true;
                    state.isAppReady = false;
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

    private async checkAuthorization(
        dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
        getState: () => IStateSchema,
    ): Promise<void> {
            //! JWT EXAMPLE
            // if (localStorage.getItem(ETokens.ACCESS) && !getState().app.isAuthenticated) {
            //     await dispatch(appActionCreators.setIsAuthenticated(true, false));
            // }
            // if (!localStorage.getItem(ETokens.ACCESS) && this.isAuth === null) {
            //     try {
            //         const { user, accessToken } = await AuthService.refresh();
            //         localStorage.setItem(ETokens.ACCESS, accessToken);
            //         console.log({ user });
            //         await dispatch(appActionCreators.setIsAuthenticated(true, false));
            //
            //     } catch (e) {
            //
            //     }
            // }
        if (localStorage.getItem(USER_LOCALSTORAGE_KEY) && !getState().app.isAuthenticated) {
            dispatch(this.setIsAuthenticated(true, false));
        }
        if (!localStorage.getItem(USER_LOCALSTORAGE_KEY) && this.isAuth === null) {

        }
        

        this.isAuth = getState().app.isAuthenticated;
    }

    private async callActions(
        actions: IPageOptions['actions'],
        dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
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

    // private async setUpFormsReducers(replaceReducer: TStateSetUpArgs['replaceReducer'], pathname: string, formState: any) {
    //     for await (const key of FormsNamesArray) {
    //         if (FormsPaths[key] === pathname && !formState?.[key]) {
    //             console.log(7777, pathname, key);
    //             await replaceReducer(key);
    //             break;
    //         }
    //     }
    // }

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
        IThunkConfig<string>
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
                dispatch,
                extra: { navigate }
            }
        ) => {
            try {
                console.info({
                    pathname, isAppReady: getState().app.isAppReady, state: getState()
                }, 'setUp::start');
                this.updateBasePageOptions(pathname, searchParams);
                //this.updateBasePageOptions(pathname, searchParams);
                await this.checkAuthorization(dispatch, getState);

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
                // (redirectedFrom !== undefined) && window.history.replaceState({}, document.title);
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
                setRestart: this.setRestart,
            },
            $stateSetup: this.setup,
        };
    }
}
export default StateSetup;
