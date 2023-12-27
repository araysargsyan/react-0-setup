import {
    type ChangeEvent,
    type FC,
    type InputHTMLAttributes,
    memo, type RefObject,
    useEffect,
    useRef,
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';

import cls from './AppInput.module.scss';


type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

interface IInputProps extends Omit<HTMLInputProps, 'value'> {
    name: string;
    value: HTMLInputProps['value'] | ((state: IStateSchema) => HTMLInputProps['value']);
    useMaskedValue?: boolean;
    mask?: string;
    className?: string;
    onChange?: ((value: string) => void) | ((value: number) => void);
    autofocus?: boolean;
}

const specialSymbolsRegexp = /[-_/\\^$*+.:,()|[\]{}]/g;
function getMaskedValue(value: string, mask: string) {
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
            } else {
                formattedValue += value[valueIndex];
                indexShift++;
            }
            valueIndex++;
        } else if (i === mask.length - 1 && i === valueIndex + indexShift) {
            const nextMaskChar = mask[valueIndex + indexShift];
            if (nextMaskChar && nextMaskChar !== '#') {
                formattedValue += nextMaskChar;
            }
        }

    }

    return formattedValue;
}

function getCleanValue(value: string) {
    return value.replace(specialSymbolsRegexp, '');
}

const AppInput: FC<IInputProps> = ({
    name,
    className,
    value,
    onChange,
    type = 'text',
    placeholder,
    autofocus,
    mask,
    useMaskedValue = false,
    ...otherProps
}) => {
    const ref = useRef<HTMLInputElement>(null);
    //const [ isFocused, setIsFocused ] = useState(false);
    //const [ caretPosition, setCaretPosition ] = useState(0);
    const cleanValue = typeof value === 'function'
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ? useSelector<IStateSchema, HTMLInputProps['value']>(value) || ''
        : value;
    const inputValue = mask ? getMaskedValue(String(cleanValue), mask) : cleanValue;
    useEffect(() => {
        console.log('AppInput', {
            name, inputValue, cleanValue
        });
    });

    useEffect(() => {
        if (autofocus) {
            //setIsFocused(true);
            ref.current?.focus();
        }
    }, [ autofocus ]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.defaultValue.slice(0, -1) === e.target.value
            ? e.target.value.slice(0, -1)
            : e.target.value;
        const value = mask ? getCleanValue(inputValue) : inputValue;
        console.log('onChangeHandler', { value, inputValue });
        if (mask ? inputValue.length < mask.length : true) {
            (onChange as (value: string) => void)?.(value);
        }
        //setCaretPosition(e.target.value.length);
    };

    // const onBlur = () => {
    //     setIsFocused(false);
    // };
    //
    // const onFocus = () => {
    //     setIsFocused(true);
    // };

    // const onSelect = (e: any) => {
    //     setCaretPosition(e?.target?.selectionStart || 0);
    // };

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
                    //onSelect={ onSelect }
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
};

export default memo(AppInput);
