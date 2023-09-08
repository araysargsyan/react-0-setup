import { type ECurrency } from 'features/Currency/model';
import { type ECountry } from 'features/Country/model';


export { default, profileActions } from './reducer/slice';
export * from './selectors';


export interface IProfile {
    firstname: string;
    lastname: string;
    age: number;
    currency: ECurrency;
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
