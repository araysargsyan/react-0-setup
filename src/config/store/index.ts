import lazyImport from 'shared/helpers/lazyImport';


export { RMActionCreators } from './lib/ReducerManager';
export const AsyncReducerProvider = lazyImport(() => import('app/providers/AsyncReducerProvider'));

export {
    default as withEnhancedStoreProvider,
    useEnhancedStoreProvider
} from './lib/EnhancedStore';

export {
    default as StateSetup,
    createAsyncCb,
    createCb,
    createCanRefetch,
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
    TAsyncReducerOptions
} from './types';
