import { FC } from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Text.module.scss';


export enum ETextTheme {
    PRIMARY = 'primary',
    ERROR = 'error',
}

interface ITextProps {
    className?: string;
    title?: string;
    text?: string;
    theme?: ETextTheme;
}

const AppText: FC<ITextProps> = ({
    className,
    text,
    title,
    theme = ETextTheme.PRIMARY,
}) => {
    return (
        <div className={ _c(cls.Text, [ className ], { [cls[theme]]: true }) }>
            { title && <p className={ cls.title }>{ title }</p> }
            { text && <p className={ cls.text }>{ text }</p> }
        </div>
    );
};

export default AppText;
