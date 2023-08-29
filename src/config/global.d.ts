declare module '*.scss' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export default classNames;
}

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
 
declare module '*.svg' {
    import { type FC, type SVGProps } from 'react';


    const SVG: FC<SVGProps<SVGSVGElement>>;
    export default SVG;
}
 
declare const __IS_DEV__: boolean;
declare const __API__: string;
declare const __PROJECT__: 'storybook' | 'frontend' | 'jest';

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
