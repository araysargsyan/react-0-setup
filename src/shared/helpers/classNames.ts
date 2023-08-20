type Mods = Record<string, boolean | string>;

export default function classNames(cls: string, additional: string[] = [], mods: Mods = {}): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            .filter(([ _, value ]) => Boolean(value))
            .map(([ className ]) => className)
    ].join(' ');
}

