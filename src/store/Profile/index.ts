export { default, profileActions } from './reducer/slice';

import { type Country, type Currency } from 'shared/const/common';


export interface IProfile {
    first: string;
    lastname: string;
    age: 22;
    currency: Currency;
    country: Country;
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
