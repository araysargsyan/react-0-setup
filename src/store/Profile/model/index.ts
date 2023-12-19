import { type TCurrency } from 'features/Currency';
import { type ECountry } from 'features/Country';


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
