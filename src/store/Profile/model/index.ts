import { type TCurrency } from 'features/Currency';
import { type ECountry } from 'features/Country';


interface IProfile {
    firstname: string;
    lastname: string;
    age: number;
    currency: TCurrency;
    country: ECountry;
    city: string;
    username: string;
    avatar: string;
}

interface IProfileSchema {
    data?: IProfile;
    isLoading: boolean;
    error?: string;
    readonly: boolean;
}

export type { IProfile, IProfileSchema };
