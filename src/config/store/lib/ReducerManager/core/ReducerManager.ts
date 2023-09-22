import {
    type ReducersMapObject,
    type Reducer,
    type CombinedState,
    type AnyAction,
    type DeepPartial,
    createAction,
    combineReducers
} from '@reduxjs/toolkit';

import {
    type IState, type INested,
    type IReducerManager,
    type IAddReducersOptions,
    type IRemoveReducersOptions,
} from '../types';


class ReducerManager {
    private reducers!: ReducersMapObject<IState>;
    private combinedReducer!: Reducer<CombinedState<IState>>;
    private nestedReducers: INested<true> = {};
    private keysToRemove: Array<keyof IState> = [];
    private parentKeysToRemove: Array<keyof INested> = [];
    private state: DeepPartial<IState & INested> | null = null;

    public initReducers = createAction(
        '@INIT:reducers',
        () => ({
            payload: {
                parentKeysToRemove: this.parentKeysToRemove,
                keysToRemove: this.keysToRemove
            } 
        })
    );
    public destroyReducers = createAction(
        '@DESTROY:reducers',
        () => ({
            payload: {
                parentKeysToRemove: this.parentKeysToRemove,
                keysToRemove: this.keysToRemove
            }
        })
    );

    public updateState = createAction(
        '@UPDATE:state',
        (payload) => {
            this.state = payload;
            return payload;
        }
    );

    create<S extends IState = IState, N extends INested = INested>(initialReducers: ReducersMapObject<IState>) {
        this.reducers = { ...initialReducers };
        this.combinedReducer = combineReducers(this.reducers);

        return {
            getReducerMap: () => this.reducers,
            reduce: (state, action) => {
                const newState = {
                    ...state,
                    ...(this.state as IState),
                };

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

                if (this.state) {
                    this.state = null;
                }

                return this.combinedReducer(newState, action);
            },
            add: (options, state) => {
                Array.isArray(options)
                    ? options.forEach((option) => {
                        this.addReducer(option as IAddReducersOptions);
                    })
                    : this.addReducer(options as IAddReducersOptions);

                if (state) {
                    this.state = state;
                }

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
            if (this.reducers[parentKey]) {
                if (this.nestedReducers[parentKey]) {
                    this.nestedReducers[parentKey][key] = reducer;
                } else {
                    this.nestedReducers[parentKey] = { [key]: reducer };
                }

            } else {
                this.nestedReducers[parentKey] = { [key]: reducer };
            }

            this.reducers[parentKey] = combineReducers<AnyAction>(this.nestedReducers[parentKey]);
        } else {
            if (this.reducers[key]) {
                return;
            }

            this.reducers[key] = reducer;
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

            delete this.nestedReducers[parentKey][key];

            if (Object.keys(this.nestedReducers[parentKey]).length) {
                this.reducers[parentKey] = combineReducers<AnyAction>(this.nestedReducers[parentKey]);
            } else {
                delete this.reducers[parentKey];
                this.parentKeysToRemove.push(parentKey);
            }
        } else {
            if (!this.reducers[key]) {
                return;
            }
            delete this.reducers[key];
            this.keysToRemove.push(key);
        }
    }
}

const instance = new ReducerManager();

export const RMActionCreators = {
    initReducers: instance.initReducers,
    destroyReducers: instance.destroyReducers,
    updateState: instance.updateState
};
export default instance;
