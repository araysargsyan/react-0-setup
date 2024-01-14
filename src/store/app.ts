import { type IStateSchema, StateSetup } from 'config/store';
import StateSetupConfig, { checkAuthorization } from 'config/store/stateSetup';
import { appReducerName, Routes } from 'shared/const';
import { createSelector } from '@reduxjs/toolkit';
// import PageLoader from 'components/PageLoader';


const stateSetupConfig = new StateSetup(
    StateSetupConfig,
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
} = stateSetupConfig;
const getIsAuthenticated = ({ app }: IStateSchema) => app.isAuthenticated;
const getIsAppReady = createSelector(
    ({ app }: IStateSchema) => app.isAppReady,
    (isReady) => isReady);


export default {
    name: appReducerName,
    reducer: appReducer
};

export {
    ProtectedElement,
    StateSetupProvider,
    appActionCreators,
    getIsAuthenticated,
    getIsAppReady,
};
