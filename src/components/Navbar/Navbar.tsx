import {
    type FC, memo, useCallback, useState
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import { useSelector } from 'react-redux';
import { userActionCreators } from 'store/User';
import LoginModal from 'features/forms/Login';
import { useActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { getIsAuthenticated } from 'store/app';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { logout } = useActions(userActionCreators, [ 'logout' ]);

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
