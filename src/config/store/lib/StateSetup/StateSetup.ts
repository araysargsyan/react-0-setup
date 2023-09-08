// import {
//     type AnyAction,
//     type AsyncThunk,
//     type ThunkAction,
//     type ThunkDispatch,
//     createAsyncThunk,
// } from '@reduxjs/toolkit';
// import { useLocation, useSearchParams } from 'react-router-dom';
// import { useEffect } from 'react';
// import { type IStateSchema } from 'config/store';
// import { useAppSelector } from 'shared/hooks/redux';
// import useRenderWatcher from 'shared/hooks/useRenderWatcher';
// import { ERoutes } from 'config/router';
// import { USER_LOCALSTORAGE_KEY } from 'shared/const';
// import { appActions } from 'store/App';
//
//
// interface IPageOption {
//     //* callback returning action creator
//     cb: () => AnyAction | ThunkAction<any, any, any, AnyAction>;
//     //* cb are sync if not defined
//     async?: true;
//     //* cb calling once if not defined, not working with API action creators(they are calling once by default)
//     canRefetch?: boolean | ((state: IStateSchema) => boolean);
// }
//
// export interface IPageOptions {
//     actions: Array<IPageOption>;
//     authRequirement: null | boolean;
// }
//
// interface IAuthProtection {
//     unAuthorized: string;
//     authorized: string;
// }
//
// export type TGetStateConfig = (searchParams: URLSearchParams) => Record<string, Partial<IPageOptions>>;
//
// type TStateSetUpArgs = {
//     pathname: string;
//     searchParams: URLSearchParams;
//     navigate: ReturnType<typeof useAppNavigate>;
//     redirectedFrom: string;
// };
// type TStateSetUp = AsyncThunk<
//     boolean | null,
//     TStateSetUpArgs,
//     {rejectValue: string; state: IStateSchema}
// >;
//
//
// class StateConfig {
//     static usePageStateSetUp = (cb: TStateSetUp) => {
//         const isAppReady = useAppSelector(({ app }) => app.isAppReady);
//         console.log('AAAAAAAA', isAppReady);
//         const { pathname, state = {} } = useLocation();
//         const [ searchParams ] = useSearchParams();
//         const navigate = useAppNavigate();
//         //const replaceReducer = useReplaceReducer(true);
//
//         useEffect(() => {
//             if (!isAppReady) {
//                 console.log('%c usePageStateSetUp: watcher on change pathname', 'color: #ae54bf');
//                 cb({
//                     pathname, searchParams, navigate, redirectedFrom: state?.from
//                 });
//             }
//         }, [ pathname, searchParams, isAppReady ]);
//
//         // useEffect(() => {
//         //
//         //     console.log('BBBBBB', isAppReady);
//         //
//         // }, [ pathname ]);
//
//         useRenderWatcher('HOOK::usePageStateSetUp', `redirected from ${state?.from}`);
//         return pathname;
//     };
//
//     private isAuth: boolean | null = null;
//     private basePageOptions: IPageOptions = {
//         actions: [],
//         authRequirement: null,
//     };
//
//     private authProtection: IAuthProtection = {
//         unAuthorized: ERoutes.LOGIN,
//         authorized: ERoutes.MAIN
//     };
//
//     private readonly getStateConfig: TGetStateConfig;
//
//     constructor(getStateConfig: TGetStateConfig) {
//         this.getStateConfig = getStateConfig;
//     }
//
//     private updateBasePageOptions(path: string, searchParams: URLSearchParams) {
//         this.basePageOptions = { ...this.basePageOptions, ...this.getStateConfig(searchParams)[path] };
//     }
//
//     private getPageOption() {
//         const { actions, authRequirement } = this.basePageOptions;
//         let redirectTo = null;
//
//         if (authRequirement !== null) {
//             redirectTo = authRequirement
//                 ? !this.isAuth
//                         ? this.authProtection.unAuthorized
//                         : null
//                 : this.isAuth
//                     ? this.authProtection.authorized
//                     : null;
//         }
//
//         return { actions, redirectTo };
//     }
//
//     private async checkAuthorization(
//         dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
//         getState: () => IStateSchema): Promise<void> {
//         if (this.basePageOptions.authRequirement) {
//             //! JWT EXAMPLE
//             // if (localStorage.getItem(ETokens.ACCESS) && !getState().app.isAuthenticated) {
//             //     await dispatch(appActionCreators.setIsAuthenticated(true, false));
//             // }
//             // if (!localStorage.getItem(ETokens.ACCESS) && this.isAuth === null) {
//             //     try {
//             //         const { user, accessToken } = await AuthService.refresh();
//             //         localStorage.setItem(ETokens.ACCESS, accessToken);
//             //         console.log({ user });
//             //         await dispatch(appActionCreators.setIsAuthenticated(true, false));
//             //
//             //     } catch (e) {
//             //
//             //     }
//             // }
//             if (localStorage.getItem(USER_LOCALSTORAGE_KEY) && !getState().app.isAuthenticated) {
//                 await dispatch(appActions.setIsAuthenticated(true, false));
//             }
//             if (!localStorage.getItem(USER_LOCALSTORAGE_KEY) && this.isAuth === null) {
//
//             }
//         }
//
//         this.isAuth = getState().app.isAuthenticated;
//     }
//
//     private async callActions(
//         actions: IPageOptions['actions'],
//         dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
//         state: IStateSchema
//     ) {
//         for (let i = 0; i < actions.length; i++) {
//             const action = actions[i];
//             const isAsync = action.async;
//             let canRefetch = null;
//             if (typeof action.canRefetch === 'function') {
//                 canRefetch = action.canRefetch(state);
//             } else if (typeof action.canRefetch === 'boolean') {
//                 canRefetch = action.canRefetch;
//             } else {
//                 action.canRefetch = false;
//                 canRefetch = true;
//             }
//
//             if (canRefetch) {
//                 if (isAsync) {
//                     console.log(55);
//                     await (dispatch(action.cb()));
//                 } else {
//                     dispatch(action.cb());
//                 }
//             }
//         }
//     }
//
//     // private async setUpFormsReducers(replaceReducer: TStateSetUpArgs['replaceReducer'], pathname: string, formState: any) {
//     //     for await (const key of FormsNamesArray) {
//     //         if (FormsPaths[key] === pathname && !formState?.[key]) {
//     //             console.log(7777, pathname, key);
//     //             await replaceReducer(key);
//     //             break;
//     //         }
//     //     }
//     // }
//
//     public setUp = createAsyncThunk<
//         boolean | null,
//         TStateSetUpArgs,
//         { rejectValue: string; state: IStateSchema }
//     >(
//         'app/stateSetUp',
//         async (
//             {
//                 pathname, searchParams, navigate, redirectedFrom
//             },
//             {
//                 rejectWithValue, fulfillWithValue, getState, dispatch
//             }
//         ) => {
//             try {
//                 console.info('app/stateSetUp::start', {
//                     pathname, redirectedFrom, isAppReady: getState().app.isAppReady, state: getState()
//                 });
//                 this.updateBasePageOptions(pathname, searchParams);
//                 console.log(this.basePageOptions, 122);
//                 await this.checkAuthorization(dispatch, getState);
//
//                 const { actions, redirectTo } = this.getPageOption();
//                 if (redirectTo) {
//                     navigate(redirectTo);
//                     console.info('app/stateSetUp::redirected', {
//                         pathname, redirectTo, isAppReady: getState().app.isAppReady, state: getState()
//                     });
//                     return fulfillWithValue(null);
//                 }
//
//                 await this.callActions(actions, dispatch, getState());
//                 //await this.setUpFormsReducers(replaceReducer, pathname, getState()?.forms);
//
//                 console.info('app/stateSetUp::end', {
//                     pathname, redirectTo, isAppReady: getState().app.isAppReady, state: getState()
//                 });
//                 return fulfillWithValue(redirectTo === null);
//                 //return fulfillWithValue({ a: this.setUpFormsReducers.bind(null, replaceReducer, pathname, getState()?.forms) });
//             } catch (err) {
//                 console.error('app/stateSetUp', err);
//                 return rejectWithValue('Something went wrong!');
//             } finally {
//                 console.log(window.history.state, redirectedFrom, 666, 'finally');
//                 redirectedFrom && window.history.replaceState({}, document.title);
//             }
//
//         }
//     );
// }
//
// export default StateConfig;
