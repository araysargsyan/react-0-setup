export type TMods = Record<string, boolean | string | undefined>;

export default function classNames(cls: string, additional: Array<string | undefined> = [], mods: TMods = {}): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            .filter(([ _, value ]) => Boolean(value))
            .map(([ className ]) => className)
    ].join(' ');
}

