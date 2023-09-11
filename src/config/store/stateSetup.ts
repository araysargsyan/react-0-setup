import { ERoutes } from 'config/router';
import { counterActions } from 'store/Counter';
import { type TStateSetupFn } from 'config/store';



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
