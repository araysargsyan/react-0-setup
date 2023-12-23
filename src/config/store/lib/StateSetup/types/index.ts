import {
    type ActionCreatorWithPreparedPayload,
    type AnyAction,
    type AsyncThunk,
    type AsyncThunkPayloadCreator,
    type ThunkDispatch
} from '@reduxjs/toolkit';
import { type ActionCreator } from 'redux';
import { type ComponentType } from 'react';
import { type Params } from 'react-router-dom';


interface IAppSchema {
    isAppReady: boolean;
    // loadingCount: number;
    loading: boolean;
    isPageReady: boolean | null;
    isAuthenticated: boolean;
    isRedirectionModalActive: boolean;
}
interface IStateSchema {
    app: IAppSchema;
}

type TDispatch = ThunkDispatch<IStateSchema, unknown, AnyAction>;
interface IThunkConfig<R = string> {
    rejectValue: R;
    state: IStateSchema;
    extra: unknown;
    dispatch: TDispatch;
}

type TCb = ((pageOptions: IBasePageOptions) => ActionCreator<any>);
type TMode = 'APP' | 'PAGE';
interface IActionCreatorsOptions {
    //* callback is function returning action creator
    //* or for async reducers u can use object with getActions that returning action creator
    cb?: TCb | {
        getAction: (module: Record<string, ReturnType<TCb>>, pageOptions: IBasePageOptions) => ReturnType<TCb>;
        //*
        key: string;
    };
    actionCreator?: ActionCreator<any>; //| ThunkAction<any, any, any, AnyAction>;
    //* cb are sync if not defined
    async?: true;
    //* cb calling once if not defined, not working with API action creators(they are calling once by default)
    canRefetch?: boolean | ((state: IStateSchema) => boolean);
    _fetched: boolean;
}
// interface IActionCreatorsOptionsWithKey<T = string> extends IActionCreatorsOptions<true> {
//     key?: string;
//     cb: (<T = Record<string, TCb>>(module: T) => T[keyof T]);
// }
// type TActionCreatorsOptions = IActionCreatorsOptions | IActionCreatorsOptionsWithKey;

interface IAuthProtection {
    //* will redirect unauthorized user to this path.
    unAuthorized: string;
    //* will redirect authorized user to this path.
    authorized: string;
}
interface INavigationOptions {
    waitUntil: 'SETUP' | 'CHECK_AUTH';
    //restartType: 'PAGE_RERENDER' | 'APP_RERENDER';
}
interface IOptionsParameter {
    appReducerName: string;
    authProtectionConfig?: IAuthProtection;
    PageLoader?: ComponentType;
}

interface IRedirectionContext<T extends string> {
    redirectTo: string;
    from: string;
    type: T;
    isPageLoaded: boolean;
}
type TUseRedirectionContext<T extends string> = () => {
    closeRedirectionModal: () => void;
    show: boolean;
    context: IRedirectionContext<T> | null;
};
// type TAsyncReducersOptions = unknown[] | ((state?: IStateSchema) => Promise<unknown[]>);
type TAsyncReducersOptionsReturn = (state?: IStateSchema) => Promise<unknown[]>;
interface IPageOptions<
    O extends string | false = false,
    AR extends TAsyncReducersOptionsReturn = TAsyncReducersOptionsReturn,
    ARO extends TAsyncReducersOptions<AR> = TAsyncReducersOptions<AR>
> {
    readonly actions: O extends string ? Array<Omit<IActionCreatorsOptions, O>> : Array<IActionCreatorsOptions>;
    //* By default null.
    //* If false it's mean that page will be enabled only for unauthenticated users.
    //* If true you know.
    readonly authRequirement: null | boolean;
    readonly asyncReducerOptions?: ARO;
    readonly onNavigate?: INavigationOptions;
}
interface IBasePageOptions extends IPageOptions {
    isPageLoaded: boolean;
    isActionsCalling: boolean;
    pageNumber?: number;
    params?: Params<string>;
}

type TAsyncReducersOptions<
    AR extends TAsyncReducersOptionsReturn = TAsyncReducersOptionsReturn,
    ARR extends Promise<any> = ReturnType<AR>,
> = (...args: Parameters<AR>) => Promise<[Awaited<ARR>, Record<string, Record<string, ReturnType<TCb>>> | null]> /*| PromiseReturnType<ARR>*/;
type TGetStateSetupConfig<
    T extends string = string,
    O extends string | false = false,
    AR extends TAsyncReducersOptionsReturn = TAsyncReducersOptionsReturn
> = (searchParams: URLSearchParams) => Partial<
    Record<
        T,
        Partial<IPageOptions<O, AR>>
    >
>;
type TStateSetupFn<
    T extends string = string,
    AR extends TAsyncReducersOptionsReturn = TAsyncReducersOptionsReturn
> = TGetStateSetupConfig<T, '_fetched', AR>;

type TAsyncReducer = {
    add: (dispatch: TDispatch, options: unknown[]) => Promise<void>;
    remove: (dispatch: TDispatch, options: unknown[]) => Promise<void>;
};
type TStateSetUpArgs = {
    pathname: string;
    pageNumber: number;
    type: 'SETUP' | 'SETUP_FIRST';
    mode: TMode;
    asyncReducer?: TAsyncReducer;
};

type TStateSetup = AsyncThunk<
    { isAppReady: boolean | null; mode: TMode },
    TStateSetUpArgs,
    IThunkConfig
>;

type TSetIsAuthenticated = ActionCreatorWithPreparedPayload<
    [isAuthenticated: boolean, restart?: boolean],
    {isAuthenticated: boolean; restart: boolean}
>;

type TCheckAuthorizationReturn = { redirectTo: string | null; mode: TMode; waitUntil: INavigationOptions['waitUntil'] | null };
type TCheckAuthorizationAsyncThunk = AsyncThunk<
    TCheckAuthorizationReturn,
    {
        pathname: string;
        searchParams: URLSearchParams;
        mode: TMode;
        // mustRedirectTo: string | null;
    },
    IThunkConfig
>;
type TCheckAuthorizationFn = (
    options: {
        isAuth: boolean | null;
    },
    config: IThunkConfig,
) => Promise<boolean>;
type TInitAuth = AsyncThunkPayloadCreator<
    TCheckAuthorizationReturn,
    Parameters<TCheckAuthorizationAsyncThunk>[0] & {checkAuthorization: TCheckAuthorizationFn},
    IThunkConfig
>;

type TypeFromConstValues<T extends Record<string, string>> = T[keyof T];
interface IinitiatedState {
    stopActionsRecall: boolean;
    mustActivateLoading: boolean;
    currentPageCount: number;
    mustRedirectTo: string | null;
    _initiated: boolean;
}

export type {
    TCb,
    TMode,
    IAppSchema,
    IStateSchema,
    TUseRedirectionContext,

    TDispatch,
    IThunkConfig,

    IAuthProtection,
    IOptionsParameter,

    IPageOptions,
    IBasePageOptions,
    TGetStateSetupConfig,
    TStateSetupFn,

    TAsyncReducersOptions,
    TAsyncReducer,
    TStateSetUpArgs,
    TStateSetup,
    IinitiatedState,

    TSetIsAuthenticated,
    TCheckAuthorizationReturn,
    TCheckAuthorizationFn,
    TCheckAuthorizationAsyncThunk,
    TInitAuth,

    TypeFromConstValues
};
