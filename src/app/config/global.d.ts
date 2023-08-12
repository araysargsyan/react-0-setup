declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export default classNames;
}

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';

declare module '*.svg' {
    import {FC, SVGProps} from 'react';

    const SVG: FC<SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare const __IS_DEV__: boolean;
