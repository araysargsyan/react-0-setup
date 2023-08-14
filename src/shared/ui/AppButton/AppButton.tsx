import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import classNames from 'helpers/classNames';

import cls from './AppButton.module.scss';


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
    theme,
    ...otherProps
}) => {
    return (
        <button
            className={ classNames(cls['app-button'], [ className, cls[theme] ], { [cls[theme]]: theme }) }
            { ...otherProps }
        >
            { children }
        </button>
    );
};

export default AppButton;
