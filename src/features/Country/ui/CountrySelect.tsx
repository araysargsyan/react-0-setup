import { useTranslation } from 'react-i18next';
import {
    type FC, memo, useCallback 
} from 'react';
import AppSelect from 'shared/ui/AppSelect';
import { type IStateSchema } from 'config/store';
import { ECountry } from 'features/Country/model';


interface ICountrySelectProps {
    name?: string;
    label?: string;
    className?: string;
    value?: ECountry;
    selector?: (state: IStateSchema) => ECountry;
    onChange?: (value: ECountry) => void;
    readonly?: boolean;
}

const options = Object.values(ECountry).map(country => ({ value: country, content: country }));

const CountrySelect: FC<ICountrySelectProps> = ({
    name = 'country',
    label = 'Set country',
    className,
    value,
    selector,
    onChange,
    readonly,
}) => {
    const { t } = useTranslation();

    const onChangeHandler = useCallback((value: string) => {
        onChange?.(value as ECountry);
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

export default memo(CountrySelect);
