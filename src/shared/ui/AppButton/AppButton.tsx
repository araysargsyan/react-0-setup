import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import classNames from 'helpers/classNames';

import cls from './AppButton.module.scss';


export enum EAppButtonTheme {
    CLEAR = 'clear',
    CLEAR_INVERTED = 'clear-inverted',
    OUTLINE = 'outline',
    BACKGROUND = 'background',
    BACKGROUND_INVERTED = 'background-inverted',
}

export enum EAppButtonSize {
    M = 'size-m',
    L = 'size-l',
    XL = 'size-xl',
}

interface IAppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    theme?: EAppButtonTheme;
    square?: boolean;
    size?: EAppButtonSize;
}
const AppButton: FC<PropsWithChildren<IAppButtonProps>> = ({
    className,
    children,
    theme = EAppButtonTheme.CLEAR,
    square,
    size = EAppButtonSize.M,
    ...otherProps
}) => {
    return (
        <button
            className={ classNames(
                cls['app-button'],
                [ className, cls[theme], cls[size] ],
                { [cls.square]: square }) }
            { ...otherProps }
        >
            { children }
        </button>
    );
};

export default AppButton;
