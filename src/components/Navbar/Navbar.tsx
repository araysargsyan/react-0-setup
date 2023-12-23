import {
    type FC, memo, useCallback, useState
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import { useSelector, useStore } from 'react-redux';
import { userActionCreators } from 'store/User';
import LoginModal from 'features/forms/Login';
import { useActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { getIsAppReady, getIsAuthenticated } from 'store/app';
import loginReducer, { loginActionCreators } from 'features/forms/Login/model';
import { type IReduxStoreWithManager } from 'config/store';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isAppReady = useSelector(getIsAppReady);
    const { logout } = useActions(userActionCreators, [ 'logout', 'setAuthData' ]);
    const { login } = useActions(loginActionCreators);
    const store = useStore() as IReduxStoreWithManager;


    function fastLogin() {
        store.reducerManager.add({
            parentKey: 'forms',
            key: loginReducer.name,
            reducer: loginReducer.reducer
        }, {
            forms: {
                login: {
                    isLoading: false,
                    username: 'admin',
                    password: '123',
                }
            }
        });
        login();
    }

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAuthModal(true);
    }, []);

    useRenderWatcher(Navbar.name, JSON.stringify({ isAuthenticated }));

    if (isAuthenticated) {
        return (
            <div className={ _c(cls.navbar,  [ className ]) }>
                <AppButton
                    id={ 'CLEAR_STORAGE' }
                    key={ 'CLEAR' }
                    style={{ color: 'cyan' }}
                    onClick={ (e) => {
                        e.currentTarget.style.color = 'crimson';
                        localStorage.removeItem(USER_LOCALSTORAGE_KEY);
                    } }
                >
                    { 'Clear storage' }
                </AppButton>
                <AppButton
                    id={ 'SIGN_OUT' }
                    key={ 'SIGN_OUT' }
                    theme={ EAppButtonTheme.CLEAR_INVERTED }
                    className={ cls.links }
                    onClick={ logout }
                >
                    { t('Выйти') }
                </AppButton>
            </div>
        );
    }

    return (
        <div className={ _c(cls.navbar, [ className ]) }>
            { isAppReady && (
                <AppButton
                    id={ 'FAST_SIGN_IN' }
                    key={ 'FAST' }
                    style={{ color: 'cyan' }}
                    theme={ EAppButtonTheme.CLEAR_INVERTED }
                    onClick={ fastLogin }
                >
                    { 'Fast Login' }
                </AppButton>
            ) }
            <AppButton
                className={ _c(cls.links) }
                theme={ EAppButtonTheme.CLEAR_INVERTED }
                onClick={ onShowModal }
            >
                { t('Sign in') }
            </AppButton>
            { isAuthModal && (
                <LoginModal
                    isOpen={ isAuthModal }
                    onClose={ onCloseModal }
                />
            ) }
        </div>
    );
};

export default memo(Navbar);
