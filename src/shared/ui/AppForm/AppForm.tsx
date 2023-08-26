import {
    type FC,
    type FormEvent,
    type FormHTMLAttributes,
    type PropsWithChildren,
    useEffect
} from 'react';
import {
    AsyncReducer, type IStateSchema, type TAsyncReducerOptions 
} from 'config/store';
import AppText, { ETextTheme } from 'shared/ui/Text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


interface IAppFormProps extends FormHTMLAttributes<HTMLFormElement> {
    reducersOption: TAsyncReducerOptions;
    title: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    error?: string;
    errorSelector?: (state: IStateSchema) => string;
}

const AppForm: FC<PropsWithChildren<IAppFormProps>> = ({
    children,
    onSubmit,
    title,
    error,
    errorSelector,
    reducersOption,
    ...defaultProps
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        console.log('AppForm', title);
    });

    const err = error
        ? error
        : errorSelector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string>(errorSelector) || ''
            : '';

    function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(e);
    }

    return (
        <AsyncReducer
            removeAfterUnmount
            options={ reducersOption }
        >
            <form
                { ...defaultProps }
                onSubmit={ onSubmitHandler }
            >

                <AppText title={ title } />
                { err && (
                    <AppText
                        text={ t(err) }
                        theme={ ETextTheme.ERROR }
                    />
                ) }
                { children }
            </form>
        </AsyncReducer>
    );
};

export default AppForm;
