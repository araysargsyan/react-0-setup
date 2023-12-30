import {
    type FC,
    type FormEvent,
    type HTMLAttributes,
    type PropsWithChildren,
    type ReactNode,
    Suspense,
    useCallback,
    useEffect,
    useMemo
} from 'react';
import { AsyncReducerProvider, type IStateSchema } from 'config/store';
import AppText, { EAppTextTheme } from 'shared/ui/Text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DynamicComponent from 'shared/ui/DynamicComponent';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { type TAsyncReducerOptions } from 'config/store/types';


enum EFormComponent {
    FORM = 'form',
    DIV = 'div',
}

interface IAppFormDefaultProps extends HTMLAttributes<HTMLFormElement | HTMLDivElement> {}
type TStyle = HTMLAttributes<HTMLElement>['style'];

interface IAppFormProps extends Omit<IAppFormDefaultProps, 'onSubmit'> {
    formComponent?: EFormComponent;
    reducerOptions?: TAsyncReducerOptions;
    title?: string;
    // state?: DeepPartial<IStateSchema>;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    error?: string;
    errorSelector?: (state: IStateSchema) => string | undefined;
    afterLoad?: () => void;
    onLoadStyle?: TStyle;
}

const FormLoader: FC<{
    cb?: () => void;
    Element: ReactNode;
}> = ({ cb, Element }) => {
    useEffect(() => {
        return () => {
            cb?.();
        };
    }, [ cb ]);

    return Element;
};

const AppForm: FC<PropsWithChildren<IAppFormProps>> = ({
    children,
    afterLoad,
    onLoadStyle,
    formComponent = EFormComponent.FORM,
    onSubmit,
    title,
    error,
    errorSelector,
    reducerOptions,
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

    const FormComponent = useCallback(({ style }: { style?: TStyle }) => {
        return (
            <DynamicComponent
                style={ style }
                TagName={ formComponent }
                { ...formProps }
            >
                { title && <AppText title={ title } /> }

                { err && (
                    <AppText
                        text={ t(err) }
                        theme={ EAppTextTheme.ERROR }
                    />
                ) }

                { children }
            </DynamicComponent>
        );
    }, [ children, err, formComponent, formProps, t, title ]);
    useRenderWatcher(AppForm.name);
    if (!reducerOptions) {
        return <FormComponent />;
    }

    return (
        <Suspense fallback={ (
            <FormLoader
                cb={ afterLoad }
                Element={ <FormComponent style={ onLoadStyle } /> }
            />
        ) }
        >
            <AsyncReducerProvider
                removeAfterUnmount
                options={ reducerOptions }
            >
                <FormComponent />
            </AsyncReducerProvider>
        </Suspense>
    );
};

export { EFormComponent };
export default AppForm;
