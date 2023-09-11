import lazyImport from 'shared/helpers/lazyImport';


export { TAsyncReducerOptions } from './lib/ReducerManager/AsyncReducer';
export {
    default as StateSetup,
    TStateSetupFn,
    IAppSchema,
    StateSetupProvider,
    usePageStateSetup
} from './lib/StateSetup';


export { default } from './store';
export {
    IStateSchema,
    TAppDispatch,
    TStore,
    IThunkConfig,
    IReduxStoreWithManager
} from './types';

export const AsyncReducer = lazyImport(() => import('./lib/ReducerManager/AsyncReducer'));
