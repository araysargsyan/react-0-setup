import {
    type FC, memo, useCallback, useState
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import { useSelector } from 'react-redux';
import { userActionCreators } from 'store/User';
import LoginModal from 'features/forms/Login';
import { useActions, useAppDispatch } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import {
    appActionCreators, getIsAppReady, getIsAuthenticated
} from 'store/app';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isAppReady = useSelector(getIsAppReady);
    const { logout } = useActions(userActionCreators, [ 'logout' ]);


    function fastLogin() {
        localStorage.setItem('user', JSON.stringify({
            id: '1',
            password: '123',
            username: 'admin',
        }));
        dispatch(appActionCreators.singIn());
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
                <h3>LOGO</h3>
                { isAppReady && (
                    <>
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
                    </>
                ) }
            </div>
        );
    }

    return (
        <div className={ _c(cls.navbar, [ className ]) }>
            <h3>LOGO</h3>
            { isAppReady && (
                <>
                    <AppButton
                        id={ 'FAST_SIGN_IN' }
                        key={ 'FAST' }
                        style={{ color: 'cyan' }}
                        theme={ EAppButtonTheme.CLEAR_INVERTED }
                        onClick={ fastLogin }
                    >
                        { 'Fast Login' }
                    </AppButton>
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
                </>
            ) }

        </div>
    );
};

export default memo(Navbar);
