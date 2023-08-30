import {
    type ChangeEvent, type FC, useMemo 
} from 'react';
import classNames from 'shared/helpers/classNames';

import cls from './AppSelect.module.scss';


interface ISelectOption {
    value: string;
    content: string;
}

interface IAppSelectProps {
    className?: string;
    label?: string;
    options?: ISelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    readonly?: boolean;
}

const AppSelect: FC<IAppSelectProps> = ({
    className,
    label,
    options,
    onChange,
    value,
    readonly,
}) => {

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    const optionsList = useMemo(() => options?.map((opt) => (
        <option
            className={ cls.option }
            value={ opt.value }
            key={ opt.value }
        >
            { opt.content }
        </option>
    )), [ options ]);

    return (
        <div className={ classNames(cls['app-select'], [ className ]) }>
            { label && (
                <span className={ cls.label }>
                    { `${label}>` }
                </span>
            ) }
            <select
                disabled={ readonly }
                className={ cls.select }
                value={ value }
                onChange={ onChangeHandler }
            >
                { optionsList }
            </select>
        </div>
    );
};

export default AppSelect;
