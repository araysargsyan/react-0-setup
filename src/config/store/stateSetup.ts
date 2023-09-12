import { ERoutes } from 'config/router';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { counterActions } from 'store/Counter';
import { userActionCreators } from 'store/User';

import { type TCheckAuthorizationFn, type TStateSetupFn, } from '.';


export const checkAuthorization: TCheckAuthorizationFn = async (
    { isAuth, setIsAuthenticated },
    { dispatch, getState }
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
    if (
        localStorage.getItem(USER_LOCALSTORAGE_KEY)
        && !getState().app.isAuthenticated
    ) {
        dispatch(userActionCreators.initAuthData());
        dispatch(setIsAuthenticated(true, false));
    }
    if (!localStorage.getItem(USER_LOCALSTORAGE_KEY) && isAuth === null) {
        //! Not Authorized
    }
};


const getStateSetupConfig: TStateSetupFn<ERoutes> = (_) =>  {
    return {
        [ERoutes.LOGIN]: { authRequirement: false, },
        [ERoutes.MAIN]: {
            // authRequirement: false,
            actions: [
                {
                    cb: counterActions.increment, canRefetch: false, async: true
                }
            ]
        },
        [ERoutes.PROFILE]: { authRequirement: true, },
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
