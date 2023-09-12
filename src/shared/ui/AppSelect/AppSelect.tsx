import {
    type ChangeEvent, type FC, useEffect, useMemo
} from 'react';
import classNames from 'shared/helpers/classNames';
import { useSelector } from 'react-redux';
import { type IStateSchema } from 'config/store';

import cls from './AppSelect.module.scss';


interface ISelectOption {
    value: string;
    content: string;
}

interface IAppSelectProps<V extends string = string> {
    name: string;
    className?: string;
    label?: string;
    options?: ISelectOption[];
    value?: string;
    selector?: (state: IStateSchema) => V;
    onChange?: (value: V) => void;
    readonly?: boolean;
}

function AppSelect<V extends string = string>({
    name,
    className,
    label,
    options,
    onChange,
    value,
    selector,
    readonly,
}: IAppSelectProps<V>): ReturnType<FC<IAppSelectProps<V>>> {

    const selectValue = value
        ? value
        : selector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string | undefined>(selector) || ''
            : '';

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value as V);
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

    useEffect(() => {
        console.log('AppSelect', { name,  selectValue });
    });

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
}

export default AppSelect;
