import { type IStateSchema, StateSetup } from 'config/store';
import getStateSetupConfig, { checkAuthorization } from 'config/store/stateSetup';
import { appReducerName } from 'shared/const';
import { ERoutes } from 'config/router';
// import PageLoader from 'components/PageLoader';


const stateSetupConfig = new StateSetup(
    getStateSetupConfig,
    checkAuthorization,
    {
        appReducerName,
        authProtectionConfig: {
            unAuthorized: ERoutes.MAIN,
            authorized: ERoutes.PROFILE
        },
        // PageLoader
    }
);
const {
    reducer: appReducer,
    actionCreators: appActionCreators,
} = stateSetupConfig.getStore();
const {
    ProtectedElement,
    StateSetupProvider,
    createRedirectionModal
} = stateSetupConfig;
const getIsAuthenticated = ({ app }: IStateSchema) => app.isAuthenticated;


export default {
    name: appReducerName,
    reducer: appReducer
};

export {
    ProtectedElement,
    StateSetupProvider,
    createRedirectionModal,
    appActionCreators,
    getIsAuthenticated,
};
