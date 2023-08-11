import {ButtonHTMLAttributes, FC, PropsWithChildren} from 'react';
import cls from './AppButton.module.scss';
import classNames from "helpers/classNames";

export enum EAppButtonTheme {
    CLEAR = 'clear'
}

interface IAppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    theme?: EAppButtonTheme;
}
const AppButton: FC<PropsWithChildren<IAppButtonProps>> = ({
    className,
    children,
    theme = EAppButtonTheme.CLEAR,
    ...otherProps
}) => {
    return (
        <button
            className={classNames(cls["app-button"], [className, cls[theme]])}
            {...otherProps}
        >
            {children}
        </button>
    );
}

export default AppButton;
