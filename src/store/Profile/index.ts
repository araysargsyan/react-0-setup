import { type ECountry } from 'features/Country';
import { type TCurrency } from 'features/Currency';


export { default, profileActionCreators } from './reducer/slice';
export * from './selectors';


export interface IProfile {
    firstname: string;
    lastname: string;
    age: number;
    currency: TCurrency;
    country: ECountry;
    city: string;
    username: string;
    avatar: string;
}

export interface IProfileSchema {
    data?: IProfile;
    isLoading: boolean;
    error?: string;
    readonly: boolean;
}
