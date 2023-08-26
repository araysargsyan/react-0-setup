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
import { useDispatch } from 'react-redux';
import { type TAppDispatch, type TAsyncReducerOptions } from 'config/store';
import AppForm from 'shared/ui/AppForm';

import loginReducer, {
    getLoginError,
    getLoginIsLoading,
    getLoginPassword,
    getLoginUsername,
    loginActions
} from '../../model';
import cls from './LoginForm.module.scss';


interface ILoginFormProps {
    className?: string;
}

const asyncReducerOptions: TAsyncReducerOptions = {
    key: loginReducer.name,
    reducer: loginReducer.reducer,
    parentKey: 'forms'
};

const LoginForm: FC<ILoginFormProps> = ({ className }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<TAppDispatch>();

    useEffect(() => {
        console.log('LoginForm');
    });

    const onChangeUsername = useCallback((value: string) => {
        dispatch(loginActions.setUsername(value));
    }, [ dispatch ]);

    const onChangePassword = useCallback((value: string) => {
        dispatch(loginActions.setPassword(value));
    }, [ dispatch ]);


    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(loginActions.login());
    }, [ dispatch ]);

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
                onChange={ onChangeUsername }
                selector={ getLoginUsername }
            />
            <AppInput
                name="password"
                type="text"
                className={ cls.input }
                placeholder={ t('Введите пароль') }
                onChange={ onChangePassword }
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
