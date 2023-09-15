import {
    type ActionCreatorWithPreparedPayload,
    type AnyAction,
    type AsyncThunk,
    type AsyncThunkPayloadCreator,
    type ThunkAction,
    type ThunkDispatch
} from '@reduxjs/toolkit';


interface IAppSchema {
    isAppReady: boolean | null | string;
    isPageReady: boolean | null;
    isAuthenticated: boolean;
    isReducersReady: boolean;
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

interface IPageOption {
    //* callback returning action creator
    cb: () => AnyAction | ThunkAction<any, any, any, AnyAction>;
    //* cb are sync if not defined
    async?: true;
    //* cb calling once if not defined, not working with API action creators(they are calling once by default)
    canRefetch?: boolean | ((state: IStateSchema) => boolean);
    _fetched: boolean;
}

interface IAuthProtection {
    //* will redirect unauthorized user to this path.
    unAuthorized: string;
    //* will redirect authorized user to this path.
    authorized: string;
}
interface IOptionsParameter {
    appReducerName: string;
    authProtectionConfig?: IAuthProtection;
}
type TAsyncReducersOptions = unknown[] | (() => Promise<unknown[]>);
interface IPageOptions<O extends string | false = false, AR = TAsyncReducersOptions> {
    actions: O extends string ? Array<Omit<IPageOption, O>> : Array<IPageOption>;
    //* By default null.
    //* If false it's mean that page will be enabled only for unauthenticated users.
    //* If true you know.
    authRequirement: null | boolean;
    asyncReducerOptions?: AR;
}
type TGetStateSetupConfig<
    T extends string = string,
    O extends string | false = false,
    AR = TAsyncReducersOptions
> = (searchParams: URLSearchParams) => Partial<
    Record<
        T,
        Partial<IPageOptions<O, AR>>
    >
>;
type TStateSetupFn<T extends string = string, AR = TAsyncReducersOptions> = TGetStateSetupConfig<T, '_fetched', AR>;

type TAsyncReducer<AR = TAsyncReducersOptions> = {
    add: (dispatch: TDispatch, options: AR) => Promise<void>;
    remove: (dispatch: TDispatch, options: AR) => Promise<void>;
};
type TStateSetUpArgs = {
    pathname: string;
    restart?: boolean;
    asyncReducer?: TAsyncReducer;
};

type TStateSetup = AsyncThunk<
    { isAppReady: boolean | null; restart: boolean },
    TStateSetUpArgs,
    IThunkConfig<string>
>;

type TSetIsAuthenticated = ActionCreatorWithPreparedPayload<
    [isAuthenticated: boolean, restart?: boolean],
    {isAuthenticated: boolean; restart: boolean}
>;
type TCheckAuthorizationFn = AsyncThunkPayloadCreator<
    boolean,
    {
        isAuth: boolean | null;
        // setIsAuthenticated: TSetIsAuthenticated;
    },
    IThunkConfig<string>
>;
type TCheckAuthorizationReturn = { redirectTo: string | null; restart: boolean };
type TCheckAuthorizationAsyncThunk = AsyncThunk<
    TCheckAuthorizationReturn,
    {
        pathname: string;
        searchParams: URLSearchParams;
        restart?: boolean;
    },
    IThunkConfig
>;
type TInitAuth = AsyncThunkPayloadCreator<
    TCheckAuthorizationReturn,
    Parameters<TCheckAuthorizationAsyncThunk>[0] & {checkAuthorization: TCheckAuthorizationFn},
    IThunkConfig
>;

export {
    IAppSchema,
    IStateSchema,

    TDispatch,
    IThunkConfig,

    IAuthProtection,
    IOptionsParameter,

    IPageOptions,
    TGetStateSetupConfig,
    TStateSetupFn,

    TAsyncReducersOptions,
    TAsyncReducer,
    TStateSetUpArgs,
    TStateSetup,

    TSetIsAuthenticated,
    TCheckAuthorizationReturn,
    TCheckAuthorizationFn,
    TCheckAuthorizationAsyncThunk,
    TInitAuth,
};
