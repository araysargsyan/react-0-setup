import { type PathRouteProps } from 'react-router-dom';
import { type ComponentType } from 'react';
import { type TAsyncReducerOptions } from 'config/store';


interface IRouterConfig extends PathRouteProps {
    Element: ComponentType;
    asyncReducers?: TAsyncReducerOptions;
}
type TRoutesConfig<T extends string> = {
    [KEY in T]: IRouterConfig
};

export default function createRoutesConfig<
    T extends string
>(config: TRoutesConfig<T>) {
    return config;
}
