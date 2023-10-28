import lazyImport from 'shared/helpers/lazyImport';


export { RMActionCreators } from './lib/ReducerManager';
export const AsyncReducer = lazyImport(() => import('./lib/ReducerManager/AsyncReducer'));


export {
    default as StateSetup,
    TStateSetupFn,
    TCheckAuthorizationFn,
    TUseRedirectionContext,
    IAppSchema
} from './lib/StateSetup';


export { default } from './store';
export {
    IStateSchema,
    TAppDispatch,
    TStore,
    IThunkConfig,
    IReduxStoreWithManager,
    TAddAsyncReducerParameters,
    TRemoveAsyncReducerParameters,
    TAsyncReducerOptions
} from './types';
