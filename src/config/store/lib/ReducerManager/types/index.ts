import {
    type AnyAction,
    type CombinedState, type DeepPartial,
    type Reducer,
    type ReducersMapObject
} from '@reduxjs/toolkit';


type TSchema = Record<string, any>;

// export interface INested<M = false> {
//     [key: string]: M extends true ? ReducersMapObject<TSchema> : TSchema;
// }

export type INested<M = false> = Partial<Record<string, M extends true ? ReducersMapObject<TSchema> : TSchema>> | TSchema;
export interface IState extends TSchema {}


export type TParentStateKeys<N = INested> = keyof N;
export type TAsyncStateKeys<S = IState> = keyof S;
// export type TNestedStateKeys<T = INested> = {
//     [K in keyof T]: T[K] extends TSchema
//         ? keyof T[K] & string
//         : never;
// }[keyof T];
export type TNestedStateKeys<T = INested> = {
    [K in keyof T]: keyof T[K]
}[Exclude<keyof T, undefined>];

// export type TAsyncStateKeys<S = IState, N = INested> = keyof Omit<S, TParentStateKeys<N>>;
// export type TNestedStateKeys<S extends IState = IState, N = INested> = Exclude<keyof S[TParentStateKeys], symbol>;

export interface IAddReducersOptions<S = IState, N = INested> {
    key: Exclude<TAsyncStateKeys<S> | TNestedStateKeys<N>, symbol>;
    parentKey?: TParentStateKeys<N>;
    reducer: Reducer;
}
export interface IRemoveReducersOptions<S = IState, N = INested> {
    key: Exclude<TAsyncStateKeys<S> | TNestedStateKeys<N>, symbol>;
    parentKey?: TParentStateKeys<N>;
}

export interface IReducerManager<S = IState, N = INested> {
    getReducerMap: () => ReducersMapObject<S>;
    reduce: (state: S, action: AnyAction) => CombinedState<S>;
    add: (
        options: IAddReducersOptions<S, N> | IAddReducersOptions<S, N>[],
        state?: DeepPartial<S & N>
    ) => void;
    remove: (options: IRemoveReducersOptions<S, N> | IRemoveReducersOptions<S, N>[]) => void;
}
