import {
    memo,
    useEffect,
    useRef,
    type ChangeEvent,
    type InputHTMLAttributes,
    type SyntheticEvent,
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';

import cls from './AppInput.module.scss';


type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

interface IMask {
    pattern: string;
    useMaskedValue?: boolean;
}
interface IInputProps<V extends HTMLInputProps['value']> extends Omit<HTMLInputProps, 'value'> {
    name: string;
    value: V | ((state: IStateSchema) => V);
    mask?: string | IMask;
    className?: string;
    // onChange?: ((value: string) => void) | ((value: number) => void);
    onChange?: (value: V extends string ? string : V) => void;
    autofocus?: boolean;
}

const specialSymbolsRegexp = /[-_/\\^$*+.:,()|[\]{}]/g;
function getMaskedValue(value: string, mask: string, useMaskedValue: boolean) {
    let formattedValue = '';
    let valueIndex = 0;
    let indexShift = 0;

    for (let i = 0; i < mask.length; i++) {
        if (value[valueIndex]) {
            const maskChar = mask[i];
            if (maskChar === '#') {
                formattedValue += value[valueIndex];

                const nextMaskChar = mask[i + indexShift + 1];
                if (nextMaskChar && nextMaskChar !== '#') {
                    formattedValue += nextMaskChar;
                }
            } else if (!useMaskedValue) {
                formattedValue += value[valueIndex];
                indexShift++;
            }
            valueIndex++;
        } else if (!useMaskedValue && i === mask.length - 1 && i === valueIndex + indexShift) {
            const nextMaskChar = mask[valueIndex + indexShift];
            if (nextMaskChar && nextMaskChar !== '#') {
                formattedValue += nextMaskChar;
            }
        } else if (i > formattedValue.length - 1) {
            break;
        }
    }

    return formattedValue;
}
function getCleanValue(value: string) {
    return value.replace(specialSymbolsRegexp, '');
}

function AppInput<V extends HTMLInputProps['value'] = HTMLInputProps['value']>({
    name,
    className,
    value,
    onChange,
    type = 'text',
    placeholder,
    autofocus,
    mask,
    ...otherProps
}: IInputProps<V>) {
    const ref = useRef<HTMLInputElement>(null);
    const caretPosition = useRef({ start: 0, end: 0 });
    const maskPattern = typeof mask === 'string' ? mask : mask?.pattern;
    const useMaskedValue = typeof mask === 'string' ? false : Boolean(mask?.useMaskedValue);
    const cleanValue = String(typeof value === 'function'
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ? useSelector<IStateSchema, HTMLInputProps['value']>(value) || ''
        : value || '');
    const inputValue = maskPattern ? getMaskedValue(String(cleanValue), maskPattern, useMaskedValue) : cleanValue;
    useEffect(() => {
        console.log('AppInput', {
            name, inputValue, cleanValue
        });
    });

    useEffect(() => {
        if (autofocus) {
            ref.current?.focus();
        }
    }, [ autofocus ]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const inputValue = e.target.defaultValue.slice(0, -1) === newValue && !newValue[newValue.length - 1]?.match(specialSymbolsRegexp)
            ? newValue.slice(0, -1)
            : newValue;
        const value = maskPattern
            ? useMaskedValue
                ? getMaskedValue(getCleanValue(inputValue), maskPattern, false)
                : getCleanValue(inputValue)
            : inputValue;
        console.log('onChangeHandler', {
            newValue,
            value,
            inputValue,
            defaultValue: e.target.defaultValue,
            caretPosition: caretPosition.current
        });
        if (maskPattern ? inputValue.length < maskPattern.length : true) {
            (onChange as (value: string) => void)?.(value);
        }
    };

    const onSelect = (e: SyntheticEvent<HTMLInputElement>) => {
        const caretPositionStart = e.currentTarget.selectionStart || 0;
        const caretPositionEnd = e.currentTarget.selectionEnd || 0;
        const movementIndex = caretPosition.current.start !== caretPositionStart
            ? caretPosition.current.start > caretPositionStart
                ? caretPositionStart - 1
                : caretPositionStart + 1
            : null;
        console.log('onSelect', e.currentTarget.selectionDirection, {
            caretPositionStart,
            caretPositionEnd,
            movementIndex,
            nextSymbol: inputValue[caretPositionStart - 1],
            inputValue,
            caretPosition: caretPosition.current
        });
        if (
            e.currentTarget.selectionDirection === 'forward'
            && movementIndex
            && inputValue.length !== caretPositionStart - 1
            && inputValue[caretPositionStart - 1]?.match(specialSymbolsRegexp)
        ) {
            // console.log(6666);
            ref.current!.selectionStart = movementIndex;
            ref.current!.selectionEnd = movementIndex;
            caretPosition.current = {
                start: movementIndex,
                end: movementIndex,
            };
        } else {
            // console.log(7777);
            caretPosition.current = {
                start: caretPositionStart,
                end: caretPositionEnd,
            };
        }
    };

    return (
        <div className={ _c(cls['app-input'], [ className ]) }>
            { placeholder && (
                <div className={ cls.placeholder }>
                    { `${placeholder}>` }
                </div>
            ) }
            <div className={ cls['caret-wrapper'] }>
                <input
                    name={ name }
                    className={ cls.input }
                    ref={ ref }
                    type={ type }
                    value={ inputValue }
                    onChange={ onChangeHandler }
                    { ...otherProps }
                    // onFocus={ onFocus }
                    // onBlur={ onBlur }
                    onSelect={ onSelect }
                />
                { /*{ isFocused && (
                    <span
                        className={ cls.caret }
                        //style={{ left: `${caretPosition * 9}px`}}
                    />
                ) }*/ }
            </div>
        </div>
    );
}
export default memo(AppInput) as typeof AppInput;
