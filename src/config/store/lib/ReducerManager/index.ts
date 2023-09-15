import lazyImport from 'shared/helpers/lazyImport';


export { default, RMActionCreators } from './core/ReducerManager';
export { IReducerManager } from './types';
export const AsyncReducer = lazyImport(() => import('./AsyncReducer'));
