import {
    type ButtonHTMLAttributes,
    type FC,
    type PropsWithChildren,
    memo,
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';
import { type ActionCreator } from 'redux';

import cls from './AppButton.module.scss';


export enum EAppButtonTheme {
    CLEAR = 'clear',
    CLEAR_INVERTED = 'clear-inverted',
    OUTLINE = 'outline',
    OUTLINE_RED = 'outline_red',
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
    disabledSelector?: (state: IStateSchema) => boolean;
}
const AppButton: FC<PropsWithChildren<IAppButtonProps>> = ({
    className,
    children,
    square,
    disabled,
    disabledSelector,
    theme = EAppButtonTheme.CLEAR,
    size = EAppButtonSize.M,
    ...otherProps
}) => {

    const mute = disabled !== undefined
        ? disabled
        : disabledSelector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, boolean>(disabledSelector)
            : false;

    return (
        <button
            className={ _c(
                cls['app-button'],
                [ className, cls[theme], cls[size] ],
                {
                    [cls.square]: square,
                    [cls.disabled]: mute
                }) }
            disabled={ mute }
            { ...otherProps }
        >
            { children }
        </button>
    );
};

export default memo(AppButton);
