import {
    type ActionCreatorWithPreparedPayload,
    type AnyAction,
    type AsyncThunk,
    type AsyncThunkPayloadCreator,
    type ThunkAction,
    type ThunkDispatch
} from '@reduxjs/toolkit';


interface IAppSchema {
    isAppReady: boolean | null;
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
    unAuthorized: string;
    authorized: string;
}
interface IOptionsParameter {
    appReducerName: string;
    authProtection?: IAuthProtection;
}

interface IPageOptions<O extends string | false = false> {
    actions: O extends string ? Array<Omit<IPageOption, O>> : Array<IPageOption>;
    authRequirement: null | boolean;
}
type TGetStateSetupConfig<
    T extends string = string,
    O extends string | false = false
> = (searchParams: URLSearchParams) => Partial<
    Record<
        T,
        Partial<IPageOptions<O>>
    >
>;
type TStateSetupFn<T extends string = string> = TGetStateSetupConfig<T, '_fetched'>;

type TStateSetUpArgs = {
    pathname: string;
    searchParams: URLSearchParams;
};
type TStateSetup = AsyncThunk<
    boolean | null,
    TStateSetUpArgs,
    IThunkConfig<string>
>;

type TSetIsAuthenticated = ActionCreatorWithPreparedPayload<
    [isAuthenticated: boolean, restart?: boolean],
    {isAuthenticated: boolean; restart: boolean}
>;
type TCheckAuthorizationFn = AsyncThunkPayloadCreator<
    void,
    {isAuth: boolean | null; setIsAuthenticated: TSetIsAuthenticated},
    IThunkConfig<string>
>;
type TCheckAuthorizationAsyncThunk = AsyncThunk<
    void,
    Parameters<TCheckAuthorizationFn>[0],
    IThunkConfig<string>
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

    TStateSetUpArgs,
    TStateSetup,

    TSetIsAuthenticated,
    TCheckAuthorizationFn,
    TCheckAuthorizationAsyncThunk
};
