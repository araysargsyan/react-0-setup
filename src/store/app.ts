import { type IStateSchema, StateSetup } from 'config/store';
import getStateSetupConfig, { checkAuthorization } from 'config/store/stateSetup';
import { appReducerName } from 'shared/const';
import { Routes } from 'config/router';
// import PageLoader from 'components/PageLoader';


const stateSetupConfig = new StateSetup(
    getStateSetupConfig,
    checkAuthorization,
    {
        appReducerName,
        authProtectionConfig: {
            unAuthorized: Routes.MAIN,
            authorized: Routes.PROFILE
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
