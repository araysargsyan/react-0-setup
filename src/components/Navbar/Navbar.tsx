import { type FC, useCallback, useState } from 'react';
import classNames from 'helpers/classNames';
import Modal from 'shared/ui/Modal';
import { useTranslation } from 'react-i18next';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [ isAuthModal, setIsAuthModal ] =  useState(false);

    const onToggleModal = useCallback(()=>{
        setIsAuthModal(prev => !prev);
    }, []);

    return (
        <div className={ classNames(cls.navbar, [ className ]) }>
            <AppButton
                className={ classNames(cls.links) }
                theme={ EAppButtonTheme.CLEAR_INVERTED }
                onClick={ onToggleModal }
            >
                { t('Sign in') }
            </AppButton>
            <Modal
                isOpen={ isAuthModal }
                onClose={ onToggleModal }
            >
                Modal content
            </Modal>
        </div>
    );
};

export default Navbar;
