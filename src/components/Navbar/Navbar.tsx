import {
    type FC, useCallback, useState 
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import LoginModal from 'features/AuthByUsername';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAuthData, userActions } from 'store/User';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] = useState(false);
    const authData = useSelector(getUserAuthData);
    const dispatch = useDispatch();

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAuthModal(true);
    }, []);

    const onLogout = useCallback(() => {
        dispatch(userActions.logout());
    }, [ dispatch ]);

    if (authData) {
        return (
            <div className={ _c(cls.navbar,  [ className ]) }>
                <AppButton
                    theme={ EAppButtonTheme.CLEAR_INVERTED }
                    className={ cls.links }
                    onClick={ onLogout }
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
            <LoginModal
                isOpen={ isAuthModal }
                onClose={ onCloseModal }
            />
        </div>
    );
};

export default Navbar;
