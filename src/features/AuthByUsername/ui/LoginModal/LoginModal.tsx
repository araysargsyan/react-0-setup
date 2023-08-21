import { type FC } from 'react';
import Modal from 'shared/ui/Modal';

import LoginForm from '../LoginForm/LoginForm';



interface ILoginModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: FC<ILoginModalProps> = ({
    className,
    isOpen,
    onClose
}) => (
    <Modal
        className={ className }
        isOpen={ isOpen }
        onClose={ onClose }
        lazy
    >
        <LoginForm />
    </Modal>
);

export default LoginModal;
