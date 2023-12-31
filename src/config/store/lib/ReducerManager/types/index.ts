import {
    type DeepPartial,
    type EnhancedStore,
    type Reducer,
    type ReducersMapObject
} from '@reduxjs/toolkit';


type TSchema = Record<string, any>;

type INested<M = false> = Partial<Record<string, M extends true ? ReducersMapObject<TSchema> : TSchema>> | TSchema;
interface IState extends TSchema {}

type TParentStateKeys<N = INested> = keyof N;
type TAsyncStateKeys<S = IState> = keyof S;
type TNestedStateKeys<T = INested> = {
    [K in keyof T]: keyof T[K]
}[Exclude<keyof T, undefined>];

interface IAddReducersOptions<S = IState, N = INested> {
    key: Exclude<TAsyncStateKeys<S> | TNestedStateKeys<N>, symbol>;
    parentKey?: TParentStateKeys<N>;
    reducer: Reducer;
}
interface IRemoveReducersOptions<S = IState, N = INested> {
    key: Exclude<TAsyncStateKeys<S> | TNestedStateKeys<N>, symbol>;
    parentKey?: TParentStateKeys<N>;
}

interface IReducerManager<S = IState, N = INested> {
    getReducerMap: () => ReducersMapObject<S>;
    reduce: Reducer<S>;
    add: (
        options: IAddReducersOptions<S, N> | IAddReducersOptions<S, N>[],
        state?: DeepPartial<S & N>
    ) => void;
    remove: (options: IRemoveReducersOptions<S, N> | IRemoveReducersOptions<S, N>[]) => void;
}

interface IStore extends EnhancedStore<IState> {
    reducerManager: IReducerManager;
}

type TAddAsyncReducerParameters = Parameters<IReducerManager['add']>;
interface IBaseAsyncReducerOptions<
    RO = TAddAsyncReducerParameters[0],
    S = TAddAsyncReducerParameters[1],
> {
    reducerOptions: RO;
    state?: S;
}

type TAsyncReducerOptions<
    TYPE extends 'cb' | 'obj' | null = null,
    RO = TAddAsyncReducerParameters[0],
    S = TAddAsyncReducerParameters[1],
    STATE = IState
> = TYPE extends 'cb'
    ? (getState: () => STATE) => Promise<IBaseAsyncReducerOptions<RO, S>>
    : TYPE extends 'obj'
        ? IBaseAsyncReducerOptions<RO, S>
        : IBaseAsyncReducerOptions<RO, S> | ((getState: () => STATE) => Promise<IBaseAsyncReducerOptions<RO, S>>);

type TAsyncReducerType<
    TYPE extends 'cb' | 'obj' | null = null,
    RO = TAddAsyncReducerParameters[0],
    S = TAddAsyncReducerParameters[1],
    STATE = IState
> = TAsyncReducerOptions<TYPE, RO, S, STATE>;

export type {
    INested,
    IState,
    IAddReducersOptions,
    IRemoveReducersOptions,
    IReducerManager,
    IStore,
    TAsyncReducerType,
    TAddAsyncReducerParameters
};
