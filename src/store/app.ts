import { StateSetup } from 'config/store';
import getStateSetupConfig from 'config/store/stateSetup';
import { appReducerName } from 'shared/const';
import { ERoutes } from 'config/router';


console.log(6666, appReducerName);
const stateSetupConfig = new StateSetup(
    getStateSetupConfig,
    {
        appReducerName,
        authProtection: {
            unAuthorized: ERoutes.MAIN,
            authorized: ERoutes.PROFILE
        }
    }
);
const appReducer = stateSetupConfig.getStoreReducer();

export const {
    ProtectedElement,
    $stateSetup,
    actionCreators: appActionCreators
} = stateSetupConfig.getStoreCreatorsActions();

export default {
    name: appReducerName,
    reducer: appReducer
};
