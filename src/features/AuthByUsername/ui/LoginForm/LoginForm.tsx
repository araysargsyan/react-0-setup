import { useTranslation } from 'react-i18next';
import _c from 'shared/helpers/classNames';
import AppInput from 'shared/ui/AppInput';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import {
    type FC,
    memo,
    useCallback,
    useEffect 
} from 'react';  
import {
    useDispatch, useSelector, useStore 
} from 'react-redux';
import AppText, { ETextTheme } from 'shared/ui/Text';
import { type IReduxStoreWithManager, type TAppDispatch } from 'config/store';

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

const LoginForm: FC<ILoginFormProps> = ({ className }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<TAppDispatch>();
    const store = useStore() as IReduxStoreWithManager;
    const username = useSelector(getLoginUsername);
    const password = useSelector(getLoginPassword);
    const isLoading = useSelector(getLoginIsLoading);
    const error = useSelector(getLoginError);

    useEffect(() => {
        console.log('use', store.getState());
        store.reducerManager.add({
            key: loginReducer.name,
            reducer: loginReducer.reducer,
            parentKey: 'forms'
        });
        dispatch({ type: `@INIT ${loginReducer.name} reducer` });

        return () => {
            store.reducerManager.remove({
                key: loginReducer.name,
                parentKey: 'forms'
            });
            dispatch({ type: `@DESTROY ${loginReducer.name} reducer` });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log('LoginForm');
    });

    const onChangeUsername = useCallback((value: string) => {
        dispatch(loginActions.setUsername(value));
    }, [ dispatch ]);

    const onChangePassword = useCallback((value: string) => {
        dispatch(loginActions.setPassword(value));
    }, [ dispatch ]);

    const onLogin = useCallback(() => {
        dispatch(loginActions.loginByUsername({
            username,
            password 
        }));
    }, [ dispatch, password, username ]);

    return (
        <div className={ _c(cls['login-form'], [ className ]) }>
            <AppText title={ t('Форма авторизации') } />
            { error && (
                <AppText
                    text={ t(error) }
                    theme={ ETextTheme.ERROR }
                />
            ) }
            <AppInput
                autofocus
                type="text"
                className={ cls.input }
                placeholder={ t('Введите username') }
                onChange={ onChangeUsername }
                value={ username }
            />
            <AppInput
                type="text"
                className={ cls.input }
                placeholder={ t('Введите пароль') }
                onChange={ onChangePassword }
                value={ password }
            />
            <AppButton
                className={ cls['login-btn'] }
                theme={ EAppButtonTheme.OUTLINE }
                disabled={ isLoading }
                onClick={ onLogin }
            >
                { t('Войти') }
            </AppButton>
        </div>
    );
};

export default memo(LoginForm);
