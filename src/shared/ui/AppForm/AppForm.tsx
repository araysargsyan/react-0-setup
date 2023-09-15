import React, {
    type FC,
    type FormEvent,
    type HTMLAttributes,
    type PropsWithChildren,
    useMemo
} from 'react';
import {
    AsyncReducer,
    type IStateSchema,
    type TAsyncReducerOptions
} from 'config/store';
import AppText, { ETextTheme } from 'shared/ui/Text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Index from 'shared/ui/DynamicComponent';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';


export enum EFormComponent {
    FORM = 'form',
    DIV = 'div',
}

interface IAppFormDefaultProps extends HTMLAttributes<HTMLFormElement | HTMLDivElement> {}

interface IAppFormProps extends Omit<IAppFormDefaultProps, 'onSubmit'> {
    formComponent?: EFormComponent;
    reducersOption?: TAsyncReducerOptions;
    title?: string;
    // state?: DeepPartial<IStateSchema>;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    error?: string;
    errorSelector?: (state: IStateSchema) => string | undefined;
}

const AppForm: FC<PropsWithChildren<IAppFormProps>> = ({
    children,
    formComponent = EFormComponent.FORM,
    onSubmit,
    title,
    error,
    errorSelector,
    reducersOption,
    //state,
    ...defaultProps
}) => {
    const { t } = useTranslation();

    const err = error
        ? error
        : errorSelector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string | undefined>(errorSelector) || ''
            : '';

    const formProps = useMemo(() => {
        const props: IAppFormDefaultProps = { ...defaultProps };
        if (formComponent === 'form') {
            props.onSubmit = (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                onSubmit?.(e);
            };
        }

        return props;
    }, [ formComponent, defaultProps, onSubmit ]);


    useRenderWatcher(AppForm.name);
    if (!reducersOption) {
        return (
            <Index
                tagName={ formComponent }
                { ...formProps }
            >
                { title && <AppText title={ title } /> }

                { err && (
                    <AppText
                        text={ t(err) }
                        theme={ ETextTheme.ERROR }
                    />
                ) }

                { children }
            </Index>
        );
    }

    return (
        <AsyncReducer
            removeAfterUnmount
            options={ reducersOption as never }
            // state={ state }
        >
            <Index
                tagName={ formComponent }
                { ...formProps }
            >
                { title && <AppText title={ title } /> }

                { err && (
                    <AppText
                        text={ t(err) }
                        theme={ ETextTheme.ERROR }
                    />
                ) }

                { children }
            </Index>
        </AsyncReducer>
    );
};

export default AppForm;
