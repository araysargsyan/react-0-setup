import {
    type ChangeEvent,
    type FC,
    type InputHTMLAttributes,
    memo,
    useEffect,
    useRef,
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';

import cls from './AppInput.module.scss';


type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

interface IInputProps extends HTMLInputProps {
    name: string;
    className?: string;
    value?: HTMLInputProps['value'];
    selector?: (state: IStateSchema) => HTMLInputProps['value'];
    onChange?: ((value: string) => void) | ((value: number) => void);
    autofocus?: boolean;
}

const AppInput: FC<IInputProps> = ({
    name,
    className,
    value,
    selector,
    onChange,
    type = 'text',
    placeholder,
    autofocus,
    ...otherProps
}) => {
    const ref = useRef<HTMLInputElement>(null);
    //const [ isFocused, setIsFocused ] = useState(false);
    //const [ caretPosition, setCaretPosition ] = useState(0);
    const inputValue = value
        ? value
        : selector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, HTMLInputProps['value']>(selector) || ''
            : '';

    useEffect(() => {
        console.log('AppInput', { name, inputValue });
    });

    useEffect(() => {
        if (autofocus) {
            //setIsFocused(true);
            ref.current?.focus();
        }
    }, [ autofocus ]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        (onChange as (value: string) => void)?.(e.target.value);
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
