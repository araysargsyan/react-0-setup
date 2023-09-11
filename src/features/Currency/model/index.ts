export const Currency = {
    RUB: 'RUB',
    EUR: 'EUR',
    USD: 'USD',
} as const;

export type TCurrency = ValueOf<typeof Currency>;
