import {ComponentType} from "react";
import {PathRouteProps} from "react-router-dom";
import lazyImport from "app/router/lib/lazyImport";

export const routesConfig: Array<PathRouteProps & { Element: ComponentType; path: string }> = [
    {
        path: '/',
        Element: lazyImport(() => import("pages/Main"))
    },
    {
        path: '/about',
        Element: lazyImport(() => import("pages/About"))
    },
];

