import {
    type ReducersMapObject,
    combineReducers,
    type Reducer,
    type CombinedState,
    type AnyAction,
} from '@reduxjs/toolkit';

import {
    type IState, type INested,
    type IReducerManager,
    type IAddReducersOptions,
    type IRemoveReducersOptions,
} from './types';


class ReducerManager {
    private reducers!: ReducersMapObject<IState>;
    private combinedReducer!: Reducer<CombinedState<IState>>;
    private nestedReducers: INested<true> = {};
    private keysToRemove: Array<keyof IState> = [];
    private parentKeysToRemove: Array<keyof INested> = [];

    create<S extends IState = IState, N extends INested = INested>(initialReducers: ReducersMapObject<IState>) {
        this.reducers = { ...initialReducers };
        this.combinedReducer = combineReducers(this.reducers);

        return {
            getReducerMap: () => this.reducers,
            reduce: (state, action) => {
                const newState = { ...state };

                if (this.keysToRemove.length > 0) {
                    this.keysToRemove.forEach((key) => {
                        delete newState[key];
                    });

                    this.keysToRemove = [];

                }
                if (this.parentKeysToRemove.length > 0) {
                    this.parentKeysToRemove.forEach((key: string) => {
                        if (Object.keys(this.nestedReducers[key]).length) {
                            Object.keys(newState[key]).forEach((nestedKey) => {
                                if (!this.nestedReducers[key][nestedKey]) {
                                    delete newState[key][nestedKey];
                                }
                            });
                        } else {
                            delete newState[key];
                        }
                    });

                    this.parentKeysToRemove = [];
                }

                return this.combinedReducer(newState, action);
            },
            add: (options) => {
                Array.isArray(options)
                    ? options.forEach((option) => {
                        this.addReducer(option as IAddReducersOptions);
                    })
                    : this.addReducer(options as IAddReducersOptions);

                this.combinedReducer = combineReducers(this.reducers);
            },
            remove: (options) => {
                Array.isArray(options)
                    ? options.forEach((option) => {
                        this.removeReducer(option as IRemoveReducersOptions);
                    })
                    : this.removeReducer(options as IRemoveReducersOptions);

                this.combinedReducer = combineReducers(this.reducers);
            },
        } as IReducerManager<S, N>;
    }

    private addReducer({
        reducer,
        key,
        parentKey
    }: IAddReducersOptions) {
        if (parentKey) {
            const currentKey = key;

            if (this.reducers[parentKey]) {
                if (this.nestedReducers[parentKey]) {
                    this.nestedReducers[parentKey][currentKey] = reducer;
                } else {
                    this.nestedReducers[parentKey] = { [currentKey]: reducer };
                }

            } else {
                this.nestedReducers[parentKey] = { [currentKey]: reducer };
            }

            this.reducers[parentKey] = combineReducers<AnyAction>(this.nestedReducers[parentKey]);
        } else {
            const currentKey = key as string;

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

            const currentKey = key;
            delete this.nestedReducers[parentKey][currentKey];

            if (Object.keys(this.nestedReducers[parentKey]).length) {
                this.reducers[parentKey] = combineReducers<AnyAction>(this.nestedReducers[parentKey]);
            } else {
                delete this.reducers[parentKey];
                this.parentKeysToRemove.push(parentKey);
            }
        } else {
            const currentKey = key as string;

            if (!this.reducers[currentKey]) {
                return;
            }
            delete this.reducers[currentKey];
            this.keysToRemove.push(currentKey);
        }
    }
}

export default new ReducerManager();
