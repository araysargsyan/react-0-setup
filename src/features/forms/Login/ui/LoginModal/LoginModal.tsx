import { type FC, Suspense } from 'react';
import Modal from 'shared/ui/Modal';
import lazyImport from 'shared/helpers/lazyImport';
import Loader from 'shared/ui/Loader';

import { type ILoginFormProps } from '../LoginForm/LoginForm';


interface ILoginModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

const LoginForm = lazyImport<FC<ILoginFormProps>>(() => import('../LoginForm/LoginForm'));
const LoginModal: FC<ILoginModalProps> = ({
    className,
    isOpen,
    onClose
}) => {
    return (
        <Modal
            className={ className }
            isOpen={ isOpen }
            onClose={ onClose }
            lazy
        >
            <Suspense fallback={ 'LoginModal' }>
                <LoginForm onSuccess={ onClose } />
            </Suspense>
        </Modal>
    );
};

export default LoginModal;
