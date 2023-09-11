import {
    type FC, memo, useCallback, useState
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import { useSelector } from 'react-redux';
import { getUserAuthData, userActions } from 'store/User';
import LoginModal from 'features/forms/Login';
import { useActions, useAppSelector } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] = useState(false);
    const authData = useSelector(getUserAuthData);
    const a = useAppSelector((state) => state.user);
    const { logout } = useActions(userActions, [ 'logout' ]);

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAuthModal(true);
    }, []);
    console.log(a);
    useRenderWatcher(Navbar.name, JSON.stringify(Boolean(authData)));

    if (authData) {
        return (
            <div className={ _c(cls.navbar,  [ className ]) }>
                <AppButton
                    theme={ EAppButtonTheme.CLEAR_INVERTED }
                    className={ cls.links }
                    onClick={ logout.bind(null, undefined) }
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
