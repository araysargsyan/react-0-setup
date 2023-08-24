import {
    type ReducersMapObject,
    combineReducers, type Reducer, type CombinedState,
} from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';
import { type INestedStateSchema } from 'config/store/types';

import {
    type TAsyncStateKeys,
    type TFormsStateKeys,
    type IReducerManager,
    type INestedReducers,
    type IAddReducersOptions,
    type IRemoveReducersOptions,
} from './types';


export default class ReducerManager {
    private reducers: ReturnType<IReducerManager['getReducerMap']>;
    private combinedReducer: Reducer<CombinedState<IStateSchema>>;
    private nestedReducers: INestedReducers = {};
    private keysToRemove: Array<keyof IStateSchema> = [];


    constructor(
        initialReducers: ReducersMapObject<IStateSchema>,
        nestedReducers?: INestedStateSchema<true>
    ) {
        this.reducers = { ...initialReducers };
        this.combinedReducer = combineReducers(this.reducers);
    }

    create(): IReducerManager {
        return {
            getReducerMap: () => this.reducers,
            reduce: (state, action) => {
                const newState = { ...state };

                if (this.keysToRemove.length > 0) {
                    this.keysToRemove.forEach((key) => {
                        if (key === 'forms') {
                            if (Object.keys(this.nestedReducers[key]).length) {
                                Object.keys(newState[key]).forEach((nestedKey) => {
                                    if (!this.nestedReducers[key][nestedKey as TFormsStateKeys]) {
                                        delete newState[key][nestedKey as TFormsStateKeys];
                                    }
                                });
                            } else {
                                delete newState[key];
                            }
                        } else {
                            delete newState[key];
                        }

                        this.keysToRemove = [];

                    });

                }

                return this.combinedReducer(newState, action);
            },
            add: (options) => {
                Array.isArray(options)
                    ? options.forEach((option) => {
                        this.addReducer(option);
                    })
                    : this.addReducer(options);

                this.combinedReducer = combineReducers(this.reducers);
            },
            remove: (options) => {
                Array.isArray(options)
                    ? options.forEach((option) => {
                        this.removeReducer(option);
                    })
                    : this.removeReducer(options);

                this.combinedReducer = combineReducers(this.reducers);
            },
        };
    }

    private addReducer({
        reducer,
        key,
        parentKey
    }: IAddReducersOptions) {
        if (parentKey) {
            const currentKey = key as TFormsStateKeys;

            if (this.reducers[parentKey]) {
                if (this.nestedReducers[parentKey]) {
                    this.nestedReducers[parentKey][currentKey] = reducer;
                } else {
                    this.nestedReducers[parentKey] = { [currentKey]: reducer };
                }

            } else {
                this.nestedReducers[parentKey] = { [currentKey]: reducer };
            }

            this.reducers[parentKey] = combineReducers(this.nestedReducers[parentKey]);
        } else {
            const currentKey = key as TAsyncStateKeys;

            if (this.reducers[currentKey]) {
                return;
            }

            this.reducers[currentKey] = reducer;
        }
    }

    private removeReducer({
        key,
        parentKey
    }: IRemoveReducersOptions) {
        if (parentKey) {
            if (!this.reducers[parentKey]) {
                return;
            }

            const currentKey = key as TFormsStateKeys;
            delete this.nestedReducers[parentKey][currentKey];

            if (Object.keys(this.nestedReducers[parentKey]).length) {
                this.reducers[parentKey] = combineReducers(this.nestedReducers[parentKey]);
            } else {
                delete this.reducers[parentKey];
                this.keysToRemove.push(parentKey);
            }
        } else {
            const currentKey = key as TAsyncStateKeys;

            if (!this.reducers[currentKey]) {
                return;
            }
            delete this.reducers[currentKey];
            this.keysToRemove.push(currentKey);
        }
    }
}

// function createReducerManager(initialReducers: ReducersMapObject<IStateSchema>): IReducerManager {
//     const reducers = { ...initialReducers };
//     const nestedReducers: INestedReducers = {};
//     let combinedReducer = combineReducers(reducers);
//     let keysToRemove: Array<keyof IStateSchema> = [];
//
//     return {
//         getReducerMap: () => reducers,
//         reduce: (state, action) => {
//             console.log('reduce', {
//                 state, keysToRemove, action, nestedReducers
//             });
//             const newState = { ...state };
//
//             if (keysToRemove.length > 0) {
//                 keysToRemove.forEach((key) => {
//                     if (key === 'forms') {
//                         if (Object.keys(nestedReducers[key]).length) {
//                             Object.keys(newState[key]).forEach((nestedKey) => {
//                                 if (!nestedReducers[key][nestedKey as TFormsStateKeys]) {
//                                     delete newState[key][nestedKey as TFormsStateKeys];
//                                 }
//                             });
//                         } else {
//                             delete newState[key];
//                         }
//                     } else {
//                         delete newState[key];
//                     }
//
//                     keysToRemove = [];
//
//                 });
//
//             }
//
//             console.log(888, newState);
//             return combinedReducer(newState, action);
//         },
//         add: (options) => {
//             console.log({
//                 reducers, nestedReducers, options
//             }, 'add:Start');
//             Array.isArray(options) &&
//             options.forEach(({
//                 reducer,
//                 key,
//                 parentKey
//             }) => {
//                 if (parentKey) {
//                     const currentKey = key as TFormsStateKeys;
//
//                     if (reducers[parentKey]) {
//                         if (nestedReducers[parentKey]) {
//                             nestedReducers[parentKey][currentKey] = reducer;
//                         } else {
//                             nestedReducers[parentKey] = { [currentKey]: reducer };
//                         }
//
//                     } else {
//                         nestedReducers[parentKey] = { [currentKey]: reducer };
//                     }
//
//                     reducers[parentKey] = combineReducers(nestedReducers[parentKey]);
//                 } else {
//                     const currentKey = key as TAsyncStateKeys;
//
//                     if (reducers[currentKey]) {
//                         return;
//                     }
//
//                     reducers[currentKey] = reducer;
//                 }
//
//             });
//
//             console.log({ reducers, nestedReducers }, 'add:END');
//             combinedReducer = combineReducers(reducers);
//         },
//         remove: (key, parentKey) => {
//             if (parentKey) {
//                 if (!reducers[parentKey]) {
//                     return;
//                 }
//
//                 const currentKey = key as TFormsStateKeys;
//                 delete nestedReducers[parentKey][currentKey];
//
//                 if (Object.keys(nestedReducers[parentKey]).length) {
//                     reducers[parentKey] = combineReducers(nestedReducers[parentKey]);
//                 } else {
//                     delete reducers[parentKey];
//                     keysToRemove.push(parentKey);
//                 }
//
//                 combinedReducer = combineReducers(reducers);
//             } else {
//                 const currentKey = key as TAsyncStateKeys;
//
//                 if (!reducers[currentKey]) {
//                     return;
//                 }
//                 delete reducers[currentKey];
//                 keysToRemove.push(currentKey);
//                 combinedReducer = combineReducers(reducers);
//             }
//         },
//     };
// }

//export default createReducerManager;
