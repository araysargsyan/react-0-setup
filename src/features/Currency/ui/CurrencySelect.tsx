import { useTranslation } from 'react-i18next';
import {
    type FC, memo, useCallback 
} from 'react';
import { ECurrency } from 'features/Currency/model';
import AppSelect from 'shared/ui/AppSelect';
import { type IStateSchema } from 'config/store';


interface ICurrencySelectProps {
    name?: string;
    label?: string;
    className?: string;
    value?: ECurrency;
    selector?: (state: IStateSchema) => ECurrency;
    onChange?: (value: ECurrency) => void;
    readonly?: boolean;
}

const options = Object.values(ECurrency).map(currency => ({ value: currency, content: currency }));

const CurrencySelect: FC<ICurrencySelectProps> = ({
    name = 'currency',
    label = 'Set currency',
    className,
    value,
    selector,
    onChange,
    readonly,
}) => {
    const { t } = useTranslation();

    const onChangeHandler = useCallback((value: string) => {
        onChange?.(value as ECurrency);
    }, [ onChange ]);

    return (
        <AppSelect
            className={ className }
            name={ name }
            label={ t(label) }
            options={ options }
            value={ value }
            selector={ selector }
            onChange={ onChangeHandler }
            readonly={ readonly }
        />
    );
};

export default memo(CurrencySelect);
