export const Currency = {
    RUB: 'RUB',
    EUR: 'EUR',
    USD: 'USD',
} as const;

export const CurrencySelectOptions = Object.values(Currency).map(currency => ({ value: currency, content: currency }));

export type TCurrency = ValueOf<typeof Currency>;
