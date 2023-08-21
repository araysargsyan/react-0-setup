import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import _c from 'shared/helpers/classNames';

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
    disabled?: boolean;
}
const AppButton: FC<PropsWithChildren<IAppButtonProps>> = ({
    className,
    children,
    square,
    disabled,
    theme = EAppButtonTheme.CLEAR,
    size = EAppButtonSize.M,
    ...otherProps
}) => {
    return (
        <button
            className={ _c(
                cls['app-button'],
                [ className, cls[theme], cls[size] ],
                {
                    [cls.square]: square,
                    [cls.disabled]: disabled
                }) }
            disabled={ disabled }
            { ...otherProps }
        >
            { children }
        </button>
    );
};

export default AppButton;
