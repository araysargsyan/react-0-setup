export enum ECountry {
    Russia = 'Russia',
    Belarus = 'Belarus',
    Ukraine = 'Ukraine',
    Kazakhstan = 'Kazahstan',
    Armenia = 'Armenia',
}

export const CountrySelectOptions = Object.values(ECountry).map(currency => ({ value: currency, content: currency }));

