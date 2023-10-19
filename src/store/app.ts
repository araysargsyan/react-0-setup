import { type IStateSchema, StateSetup } from 'config/store';
import getStateSetupConfig, { checkAuthorization } from 'config/store/stateSetup';
import { appReducerName } from 'shared/const';
import { ERoutes } from 'config/router';


const stateSetupConfig = new StateSetup(
    getStateSetupConfig,
    checkAuthorization,
    {
        appReducerName,
        authProtectionConfig: {
            unAuthorized: ERoutes.MAIN,
            authorized: ERoutes.PROFILE
        },
        navigateOptions: { waitUntil: 'CHECK_AUTH' }
    }
);
const appReducer = stateSetupConfig.getStoreReducer();

const {
    ProtectedElement,
    usePageStateSetup,
    actionCreators: appActionCreators,
} = stateSetupConfig.getStoreCreatorsActions();

export default {
    name: appReducerName,
    reducer: appReducer
};

const getIsAuthenticated = ({ app }: IStateSchema) => app.isAuthenticated;

export {
    ProtectedElement,
    appActionCreators,
    usePageStateSetup,
    getIsAuthenticated,
};
