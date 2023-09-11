import {
    type AnyAction, type AsyncThunk, type ThunkAction
} from '@reduxjs/toolkit';
import { type IStateSchema, type IThunkConfig } from 'config/store';


interface IPageOption {
    //* callback returning action creator
    cb: () => AnyAction | ThunkAction<any, any, any, AnyAction>;
    //* cb are sync if not defined
    async?: true;
    //* cb calling once if not defined, not working with API action creators(they are calling once by default)
    canRefetch?: boolean | ((state: IStateSchema) => boolean);
    _fetched: boolean;
}


export interface IPageOptions<O extends string | false = false> {
    actions: O extends string ? Array<Omit<IPageOption, O>> : Array<IPageOption>;
    authRequirement: null | boolean;
}

export interface IOptions {
    appReducerName: string;
    authProtection?: IAuthProtection;
}


export interface IAppSchema {
    isAppReady: boolean | null;
    isAuthenticated: boolean;
    isReducersReady: boolean;
}
export interface IAuthProtection {
    unAuthorized: string;
    authorized: string;
}

export type TGetStateSetupConfig<T extends string = string, O extends string | false = false> = (searchParams: URLSearchParams) => Partial<
    Record<
        T,
        Partial<IPageOptions<O>>
    >
>;

export type TStateSetupFn<T extends string = string> = TGetStateSetupConfig<T, '_fetched'>;

export type TStateSetUpArgs = {
    pathname: string;
    searchParams: URLSearchParams;
};

export type TStateSetup = AsyncThunk<
    boolean | null,
    TStateSetUpArgs,
    IThunkConfig<string>
>;
