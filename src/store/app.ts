import { type IStateSchema, StateSetup } from 'config/store';
import getStateSetupConfig, { checkAuthorization } from 'config/store/stateSetup';
import { appReducerName } from 'shared/const';
import { ERoutes } from 'config/router';


const stateSetupConfig = new StateSetup(
    getStateSetupConfig,
    checkAuthorization,
    {
        appReducerName,
        authProtection: {
            unAuthorized: ERoutes.MAIN,
            authorized: ERoutes.PROFILE
        }
    }
);
const appReducer = stateSetupConfig.getStoreReducer();

const {
    ProtectedElement,
    $stateSetup,
    actionCreators: appActionCreators
} = stateSetupConfig.getStoreCreatorsActions();

export default {
    name: appReducerName,
    reducer: appReducer
};

const getIsAuthenticated = ({ app }: IStateSchema) => app.isAuthenticated;

export {
    ProtectedElement,
    $stateSetup,
    appActionCreators,
    getIsAuthenticated
};
