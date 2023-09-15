import { ERoutes } from 'config/router';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { counterActions } from 'store/Counter';
import { userActionCreators } from 'store/User';
import { profileActions } from 'store/Profile';
import until from 'app/dubag/util/wait';

import {
    type TAsyncReducerOptions,
    type TStateSetupFn,
    type TCheckAuthorizationFn,
} from '.';


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
    //         console.log({ user });
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


const getStateSetupConfig: TStateSetupFn<ERoutes, TAsyncReducerOptions> = (_) =>  {
    return {
        [ERoutes.LOGIN]: { authRequirement: false, },
        [ERoutes.MAIN]: {
            // authRequirement: false,
            actions: [
                {
                    cb: counterActions.increment, canRefetch: true, async: true
                }
            ]
        },
        [ERoutes.PROFILE]: {
            authRequirement: true,
            asyncReducerOptions: async () => {
                const profileReducer = (await import('store/Profile')).default;

                const options = {
                    key: profileReducer.name,
                    reducer: profileReducer.reducer,
                };
                return [ options ];
            },
            actions: [
                { cb: profileActions.fetchData, canRefetch: true }
            ]
        },
        [ERoutes.ABOUT]: {
            authRequirement: false,
            actions: [
                { cb: counterActions.increment, canRefetch: true },
                { cb: counterActions.increment },
                { cb: counterActions.increment },
                { cb: counterActions.increment },
                    // {
                    //     cb: calculateFormActionCreators.setHomePrice.bind(null, homePrice),
                    // },
                    // {
                    //     cb: calculateFormActionCreators.setCashAvailable.bind(null, cashAvailable),
                    // },
                    // {
                    //     cb: calculateFormActionCreators.setInterestRate.bind(null, interestRate),
                    // },
                    // {
                    //     cb: calculateFormActionCreators.setRentalYield.bind(null, rentalYield),
                    // },
                    // {
                    //     cb: calculateFormActionCreators.calculate,
                    //     canRefetch: true,
                    //     async: true
                    // },
            ]
        }
    };
};

export default getStateSetupConfig;
