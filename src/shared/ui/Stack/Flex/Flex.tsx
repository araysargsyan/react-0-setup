import {
    type DetailedHTMLProps,
    type FC,
    type HTMLAttributes, type PropsWithChildren,
    type ReactNode
} from 'react';
import _c, { type TMods } from 'shared/helpers/classNames';

import cls from './Flex.module.scss';


type TFlexJustify = 'start' | 'center' | 'end' | 'between';
type TFlexAlign = 'start' | 'center' | 'end';
type TFlexDirection = 'row' | 'column';
type TFlexGap = '4' | '8' | '16' | '32';

const justifyClasses: Record<TFlexJustify, string> = {
    start: cls['justify-start'],
    center: cls['justify-center'],
    end: cls['justify-end'],
    between: cls['justify-between'],
};

const alignClasses: Record<TFlexAlign, string> = {
    start: cls['align-start'],
    center: cls['align-center'],
    end: cls['align-end'],
};

const directionClasses: Record<TFlexDirection, string> = {
    row: cls['direction-row'],
    column: cls['direction-column'],
};

const gapClasses: Record<TFlexGap, string> = {
    4: cls.gap4,
    8: cls.gap8,
    16: cls.gap16,
    32: cls.gap32,
};

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface IFlexProps extends TDivProps {
    className?: string;
    justify?: TFlexJustify;
    align?: TFlexAlign;
    direction?: TFlexDirection;
    gap?: TFlexGap;
    max?: boolean;
}

const Flex: FC<PropsWithChildren<IFlexProps>> = ({
    className,
    children,
    justify,
    align,
    direction,
    gap,
    max,
}) => {
    const classes = [
        className,
        justify && justifyClasses[justify],
        align && alignClasses[align],
        direction && directionClasses[direction],
        gap && gapClasses[gap],
    ];

    const mods: TMods = { [cls.max]: max };

    return (
        <div className={ _c(cls.flex, classes, mods) }>
            { children }
        </div>
    );
};

export type { IFlexProps };

export default Flex;
