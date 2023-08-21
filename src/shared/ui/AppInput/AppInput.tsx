import {
    type ChangeEvent,
    type FC,
    type InputHTMLAttributes,
    memo,
    useEffect,
    useRef,
} from 'react';
import _c from 'shared/helpers/classNames';

import cls from './AppInput.module.scss';


type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface IInputProps extends HTMLInputProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    autofocus?: boolean;
}

const AppInput: FC<IInputProps> = ({
    className,
    value,
    onChange,
    type = 'text',
    placeholder,
    autofocus,
    ...otherProps
}) => {
    const ref = useRef<HTMLInputElement>(null);
    //const [ isFocused, setIsFocused ] = useState(false);
    //const [ caretPosition, setCaretPosition ] = useState(0);

    useEffect(() => {
        console.log('AppInput', value);
    });

    useEffect(() => {
        if (autofocus) {
            // setIsFocused(true);
            ref.current?.focus();
        }
    }, [ autofocus ]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
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
                    ref={ ref }
                    type={ type }
                    value={ value }
                    onChange={ onChangeHandler }
                    className={ cls.input }
                    // onFocus={ onFocus }
                    // onBlur={ onBlur }
                    //onSelect={ onSelect }
                    { ...otherProps }
                />
                { /*{ isFocused && (*/ }
                { /*    <span*/ }
                { /*        className={ cls.caret }*/ }
                { /*        style={{ left: `${caretPosition * 9}px` }}*/ }
                { /*    />*/ }
                { /*) }*/ }
            </div>
        </div>
    );
};

export default memo(AppInput);
