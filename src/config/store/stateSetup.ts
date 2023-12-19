import { Routes, type TRoutes } from 'config/router';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { counterActionCreators } from 'store/Counter';
import { userActionCreators } from 'store/User';
import until from 'app/dubag/util/wait';
import { type TProfileActions } from 'store/Profile/reducer/slice';

import {
    type TAsyncReducerOptions,
    type TStateSetupFn,
    type TCheckAuthorizationFn,
    type IStateSchema,
} from '.';


const getStateSetupConfig: TStateSetupFn<TRoutes, TAsyncReducerOptions<true>> = (_) =>  {
    return {
        [Routes.ARTICLE_DETAILS]: { authRequirement: null },
        [Routes.MAIN]: {
            authRequirement: null,
            actions: [ //! if async is true this action call will wait in initial setup, by default false
                {
                    cb: counterActionCreators.fetchTest,
                    canRefetch: true,
                    async: true,
                },
                {
                    cb: counterActionCreators.increment,
                    canRefetch: (state) => { //! Boolean or cb with state param and returned boolean
                        return (state as IStateSchema).counter.value < 18;
                    },
                },
            ],
            // onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
        [Routes.TEST]: {
            authRequirement: null,
            actions: [ //! if async is true this action call will wait in initial setup, by default false
                {
                    cb: counterActionCreators.increment,
                    canRefetch: (state) => { //! Boolean or cb with state param and returned boolean
                        return (state as IStateSchema).counter.value < 18;
                    },
                },
            ],
        },
        [Routes.PROFILE]: {
            authRequirement: true,
            asyncReducerOptions: async (_) => {
                const profileModule = await import('store/Profile');

                return [
                    [
                        [ //! asyncReducerOptions can be multiple
                            {
                                key: profileModule.default.name,
                                reducer: profileModule.default.reducer,
                            },
                        ],
                        //* ...state
                        { counter: { value: 4, testData: 'REPLACED TEST DATA' } }
                    ],
                    //! asyncActionCreators, key of this object needed to be in cb.key
                    { profile: profileModule.profileActionCreators }
                ];
            },
            actions: [ //! async actions must be first
                {
                    cb: {
                        key: 'profile',
                        getAction: (profileActionCreators) => (profileActionCreators as TProfileActions).fetchData
                    },
                    async: true,
                    canRefetch: true
                },
                { cb: counterActionCreators.decrement, canRefetch: true },
            ],
            onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
        [Routes.ABOUT]: {
            authRequirement: false,
            actions: [
                {
                    cb: counterActionCreators.fetchTest,
                    canRefetch: true,
                    async: true,
                },
                { cb: counterActionCreators.decrement, canRefetch: true },
                { cb: counterActionCreators.increment },
                { cb: counterActionCreators.increment },
                { cb: counterActionCreators.increment },
            ],
            onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
    };
};

export const checkAuthorization: TCheckAuthorizationFn = async (
    { isAuth },
    { dispatch }
) => {
    //! JWT EXAMPLE
    // if (localStorage.getItem(ETokens.ACCESS) && !getState().app.isAuthenticated) {
    //     await dispatch(appActionCreators.setIsAuthenticated(true, false));
    // }
    // if (!localStorage.getItem(ETokens.ACCESS) && this.isAuth === null) {
    //     try {
    //         const { user, accessToken } = await AuthService.refresh();
    //         localStorage.setItem(ETokens.ACCESS, accessToken);
    //         await dispatch(appActionCreators.setIsAuthenticated(true, false));
    //
    //     } catch (e) {
    //
    //     }
    // }

    // await until(1000);

    if (
        localStorage.getItem(USER_LOCALSTORAGE_KEY)
        //&& !getState().app.isAuthenticated
    ) {
        dispatch(userActionCreators.initAuthData());
        return true;
    }
    if (!localStorage.getItem(USER_LOCALSTORAGE_KEY) && isAuth === null) {
        return false;
        //! Not Authorized
    }
    return false;
};

export default getStateSetupConfig;
