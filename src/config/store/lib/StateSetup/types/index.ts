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

type TCb<P extends Params<string> = Params<string>> = ((pageOptions: Required<TPageOptionsArgument<P>>) => ActionCreator<any>);
interface IAsyncCb<
    T extends Record<string, ReturnType<TCb>> = Record<string, ReturnType<TCb>>,
    P extends Params<string> = Params<string>
> {
    getAction: (
        module: T, //* is a one of moduleKeys from asyncReducerOptions returns second items
        pageOptions: Required<TPageOptionsArgument<P>>
    ) => ReturnType<TCb>;
    moduleKey: string;
}

interface IActionCreatorsOptions {
    //* callback is function returning action creator
    //* or if using async reducers u can use object with getActions that returning action creator
    cb?: TCb | IAsyncCb;
    //* define actionCreator if u not need pageOptions
    actionCreator?: ActionCreator<any>; //| ThunkAction<any, any, any, AnyAction>;
    //* cb are sync if not defined
    async?: true;
    //* Boolean or function with state param and returned boolean
    //* cb calling once if not defined
    canRefetch?: boolean | ((state: IStateSchema) => boolean);
    _fetched: boolean;
}

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

type TAsyncReducersOptionsReturn<STATE = any> = (getState: () => STATE) => Promise<any>;
interface IPageOptions<
    O extends string | false = false,
    AR extends TAsyncReducersOptionsReturn<IStateSchema> = TAsyncReducersOptionsReturn<IStateSchema>,
    ARO extends TAsyncReducersOptions<AR> = TAsyncReducersOptions<AR>
> {
    readonly actions: O extends string ? Array<Omit<IActionCreatorsOptions, O>> : Array<IActionCreatorsOptions>;
    //* By default null.
    //* If false it's mean that page will be enabled only for unauthenticated users.
    //* If true you know.
    readonly authRequirement: null | boolean;
    //* returning cottage where first item is reducerOptions
    //* and second item is object with key as moduleKey and value as actionCreators oobj
    readonly asyncReducerOptions?: ARO;
    readonly onLoading?: (dispatch: TDispatch, pageOptions: Required<TPageOptionsArgument>) => void;
    readonly onNavigate?: INavigationOptions;
}

interface IBasePageOptions<P extends Params<string> = Params<string>> extends IPageOptions {
    isPageLoaded: boolean;
    isActionsCalling: boolean;
    pageNumber?: number;
    params: P;
}
type TPageOptionsArgument<P extends Params<string> = Params<string>> = Pick<
    IBasePageOptions<P>,
    'isPageLoaded' | 'isActionsCalling' | 'pageNumber' | 'params'
>;

type TAsyncReducersOptions<
    AR extends TAsyncReducersOptionsReturn<IStateSchema> = TAsyncReducersOptionsReturn<IStateSchema>,
    ARR extends Promise<any> = ReturnType<AR>,
> = (...args: Parameters<AR>) => Promise<{
    moduleNames: string[];
    options: Awaited<ARR>;
    actionCreators?: Record<string, Record<string, ReturnType<TCb>>> | null;
}>;
type TGetStateSetupConfig<
    T extends string = string,
    O extends string | false = false,
    AR extends TAsyncReducersOptionsReturn<IStateSchema> = TAsyncReducersOptionsReturn<IStateSchema>
> = (searchParams: URLSearchParams) => {
    [K in T]: Partial<IPageOptions<O, AR>>
};
type TStateSetupFn<
    T extends string = string,
    AR extends TAsyncReducersOptionsReturn<IStateSchema> = TAsyncReducersOptionsReturn<IStateSchema>
> = TGetStateSetupConfig<T, '_fetched', AR>;

type TAsyncReducer = {
    add: (extra: {
            dispatch: TDispatch;
            getState: () => IStateSchema;
        },
        options: any,
        moduleNames: {
            current?: string[];
            prev?: string[];
        }
    ) => Promise<void>;
    remove: (extra: {
            dispatch: TDispatch;
            getState: () => IStateSchema;
        },
        options: any,
        moduleNames: {
            current?: string[];
            prev?: string[];
        }
    ) => Promise<void>;
};
type TStateSetUpArgs = {
    pathname: string;
    pageNumber: number;
    type: 'SETUP' | 'SETUP_FIRST';
    asyncReducer?: TAsyncReducer;
};

type TStateSetup = AsyncThunk<
    void,
    TStateSetUpArgs,
    IThunkConfig
>;

type TSetIsAuthenticated = ActionCreatorWithPreparedPayload<
    [isAuthenticated: boolean, restart?: boolean],
    {isAuthenticated: boolean; restart: boolean}
>;

type TCheckAuthorizationReturn = { redirectTo: string | null; waitUntil: INavigationOptions['waitUntil'] | null };
type TCheckAuthorizationAsyncThunk = AsyncThunk<
    TCheckAuthorizationReturn,
    {
        pathname: string;
        searchParams: URLSearchParams;
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
    IAppSchema,
    IStateSchema,
    TUseRedirectionContext,

    TDispatch,
    IThunkConfig,

    IAuthProtection,
    IOptionsParameter,

    IPageOptions,
    IBasePageOptions,
    TPageOptionsArgument,
    IAsyncCb,
    TGetStateSetupConfig,
    TStateSetupFn,

    TAsyncReducersOptionsReturn,
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
