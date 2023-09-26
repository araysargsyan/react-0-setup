import { ERoutes } from 'config/router';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { counterActions } from 'store/Counter';
import { userActionCreators } from 'store/User';
import until from 'app/dubag/util/wait';
import { type TProfileActions } from 'store/Profile/reducer/slice';

import {
    type TAsyncReducerOptions,
    type TStateSetupFn,
    type TCheckAuthorizationFn,
    type IStateSchema,
} from '.';


const getStateSetupConfig: TStateSetupFn<ERoutes, TAsyncReducerOptions<true>> = (_) =>  {
    return {
        [ERoutes.LOGIN]: { authRequirement: false, },
        [ERoutes.MAIN]: {
            authRequirement: null,
            actions: [ //! if async is true this action call will wait in initial setup, by default false
                {
                    cb: counterActions.increment.bind(null, 9),
                    canRefetch: (state) => { //! Boolean or cb with state param and returned boolean
                        return (state as IStateSchema).counter.value < 18;
                    },
                },
                {
                    cb: counterActions.fetchTest, async: true, canRefetch: true 
                }
            ],
            onNavigate: { waitUntil: 'CHECK_AUTH', } //! by default
        },
        [ERoutes.PROFILE]: {
            authRequirement: true,
            asyncReducerOptions: async (_) => {
                const profileModule = await import('store/Profile');
                console.log(7777, _);
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
                    { profile: profileModule.profileActions }
                ];
            },
            actions: [ //! async actions must be first
                {
                    cb: {
                        key: 'profile',
                        getAction: (profileActions) => (profileActions as TProfileActions).fetchData
                    },
                    async: true,
                    canRefetch: true
                }
            ],
            onNavigate: { waitUntil: 'SETUP', }
        },
        [ERoutes.ABOUT]: {
            authRequirement: false,
            actions: [
                { cb: counterActions.increment, canRefetch: true },
                { cb: counterActions.increment },
                { cb: counterActions.increment },
                { cb: counterActions.increment },
            ],
            // onNavigate: { waitUntil: 'SETUP', }
        }
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
    await until(1200);

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
