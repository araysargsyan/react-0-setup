import {
    type ChangeEvent, type FC, useEffect, useMemo
} from 'react';
import classNames from 'shared/helpers/classNames';
import { useSelector } from 'react-redux';
import { type IStateSchema } from 'config/store';
import { ECurrency } from 'features/Currency/model';

import cls from './AppSelect.module.scss';


interface ISelectOption {
    value: string;
    content: string;
}

interface IAppSelectProps {
    name: string;
    className?: string;
    label?: string;
    options?: ISelectOption[];
    value?: string;
    selector?: (state: IStateSchema) => string;
    onChange?: (value: string) => void;
    readonly?: boolean;
}

const AppSelect: FC<IAppSelectProps> = ({
    name,
    className,
    label,
    options,
    onChange,
    value,
    selector,
    readonly,
}) => {

    const selectValue = value
        ? value
        : selector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string | undefined>(selector) || ''
            : '';

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    useEffect(() => {
        console.log('AppSelect', { name,  selectValue });
    });

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
                name={ name }
                disabled={ readonly }
                className={ cls.select }
                value={ selectValue }
                onChange={ onChangeHandler }
            >
                { optionsList }
            </select>
        </div>
    );
};

export default AppSelect;
