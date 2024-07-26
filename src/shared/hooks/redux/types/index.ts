import { type ActionCreator } from 'redux';
import { type AsyncThunkAction } from '@reduxjs/toolkit';
import { type InferThunkActionCreatorType } from 'react-redux';
import { type DependencyList } from 'react';
import { type NavigateOptions, type To } from 'react-router-dom';


interface IHistoryState {
    from?: string;
}
type TAction = ActionCreator<any> | AsyncThunkAction<any, any, any>;
type TModule<T> = { [K in keyof T]: TAction };
type TAsyncModule<T extends TModule<T>> = () => Promise<
    { [K in string]: TModule<T> | unknown }
    & {default: unknown}
>;
type TReturnedActions<T extends TModule<T>, K extends keyof T> = {
    [KEY in K]: ReturnType<T[KEY]> extends AnyFunction ? InferThunkActionCreatorType<T[KEY]> : T[KEY]
};
type TUseDynamicActionsOptions = {
    moduleKey: string;
    when?: boolean;
    deps?: DependencyList;
    cb?: () => void;
};

interface TNavigateOptions extends NavigateOptions {
    state?: IHistoryState;
}

type TAppNavigateFunction = (to: To, options?: TNavigateOptions) => void;

export type {
    IHistoryState,
    TAction,
    TModule,
    TReturnedActions,
    TAsyncModule,
    TUseDynamicActionsOptions,
    TAppNavigateFunction
};
