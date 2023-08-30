import lazyImport from 'shared/helpers/lazyImport';


export { TAsyncReducerOptions } from './lib/AsyncReducer';

export { default } from './store';
export {
    IStateSchema,
    TAppDispatch,
    TStore,
    IThunkConfig,
    IReduxStoreWithManager
} from './types';

export const AsyncReducer = lazyImport(() => import('./lib/AsyncReducer'));

