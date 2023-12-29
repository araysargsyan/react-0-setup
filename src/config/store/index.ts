import lazyImport from 'shared/helpers/lazyImport';


export { RMActionCreators } from './lib/ReducerManager';
export const AsyncReducer = lazyImport(() => import('./lib/ReducerManager/AsyncReducer'));

export {
    default as withEnhancedStoreProvider,
    useEnhancedStoreProvider
} from './lib/EnhancedStore';

export {
    default as StateSetup,
    createAsyncCb,
    createRedirectionModal,
    RedirectionTypes,
    type TStateSetupFn,
    type TCheckAuthorizationFn,
    type IAppSchema
} from './lib/StateSetup';


export { default } from './store';
export type {
    IStateSchema,
    TAppDispatch,
    TStore,
    IThunkConfig,
    IReduxStoreWithManager,
    TAddAsyncReducerParameters,
    TRemoveAsyncReducerParameters,
    TAsyncReducerOptions
} from './types';
