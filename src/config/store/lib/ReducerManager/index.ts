import lazyImport from 'shared/helpers/lazyImport';


export { default } from './core/ReducerManager';
export { IReducerManager } from './types';
export { TAsyncReducerOptions } from './AsyncReducer';
export const AsyncReducer = lazyImport(() => import('./AsyncReducer'));
