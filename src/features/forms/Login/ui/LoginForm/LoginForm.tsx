import { useTranslation } from 'react-i18next';
import _c from 'shared/helpers/classNames';
import AppInput from 'shared/ui/AppInput';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import {
    type FC, type FormEvent,
    memo,
    useCallback,
    useEffect
} from 'react';
import { type TAsyncReducerOptions } from 'config/store';
import AppForm from 'shared/ui/AppForm';
import { useActions } from 'shared/hooks/redux';
import { type TAddAsyncReducerOp } from 'config/store/types';

import loginReducer, {
    getLoginError,
    getLoginIsLoading,
    getLoginPassword,
    getLoginUsername,
    loginActionCreators
} from '../../model';
import cls from './LoginForm.module.scss';


export interface ILoginFormProps {
    className?: string;
    onSuccess: () => void;
}

const asyncReducerOptions: TAddAsyncReducerOp = [ {
    key: loginReducer.name,
    reducer: loginReducer.reducer,
    parentKey: 'forms'
} ];

const LoginForm: FC<ILoginFormProps> = ({ className, onSuccess }) => {
    const { t } = useTranslation();

    const {
        login,
        setUsername,
        setPassword
    } = useActions(loginActionCreators);

    useEffect(() => {
        console.log('RENDER::LoginForm');
    });

    const onSubmit = useCallback(async (_: FormEvent<HTMLFormElement>) => {
        const result = await login();

        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
        }
    }, [ onSuccess, login ]);

    return (
        <AppForm
            title={ t('Форма авторизации') }
            errorSelector={ getLoginError }
            reducersOption={ asyncReducerOptions }
            className={ _c(cls['login-form'], [ className ]) }
            onSubmit={ onSubmit }
        >
            <AppInput
                name="username"
                autofocus
                type="text"
                className={ cls.input }
                placeholder={ t('Введите username') }
                onChange={ setUsername }
                selector={ getLoginUsername }
            />
            <AppInput
                name="password"
                type="text"
                className={ cls.input }
                placeholder={ t('Введите пароль') }
                onChange={ setPassword }
                selector={ getLoginPassword }
            />
            <AppButton
                className={ cls['login-btn'] }
                theme={ EAppButtonTheme.OUTLINE }
                disabledSelector={ getLoginIsLoading }
                    //onClick={ onLogin }
            >
                { t('Войти') }
            </AppButton>
        </AppForm>
    );
};

export default memo(LoginForm);
