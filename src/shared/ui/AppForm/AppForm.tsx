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
import { AsyncReducer, type IStateSchema } from 'config/store';
import AppText, { EAppTextTheme } from 'shared/ui/Text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DynamicComponent from 'shared/ui/DynamicComponent';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { type TAddAsyncReducerOp } from 'config/store/types';


enum EFormComponent {
    FORM = 'form',
    DIV = 'div',
}

interface IAppFormDefaultProps extends HTMLAttributes<HTMLFormElement | HTMLDivElement> {}

interface IAppFormProps extends Omit<IAppFormDefaultProps, 'onSubmit'> {
    formComponent?: EFormComponent;
    reducersOption?: TAddAsyncReducerOp;
    title?: string;
    state?: DeepPartial<IStateSchema>;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    error?: string;
    errorSelector?: (state: IStateSchema) => string | undefined;
    afterLoad?: () => void;
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
    formComponent = EFormComponent.FORM,
    onSubmit,
    title,
    error,
    errorSelector,
    reducersOption,
    state,
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

    const FormComponent = useCallback(({ style }: {
        style?: HTMLAttributes<HTMLElement>['style']; }
    ) => {
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
    if (!reducersOption) {
        return <FormComponent />;
    }

    return (
        <Suspense fallback={ (
            <FormLoader
                cb={ afterLoad }
                Element={ <FormComponent style={{ opacity: '0.7' }} /> }
            />
        ) }
        >
            <AsyncReducer
                removeAfterUnmount
                options={ reducersOption as never }
                state={ state }
            >
                <FormComponent />
            </AsyncReducer>
        </Suspense>
    );
};

export { EFormComponent };
export default AppForm;
