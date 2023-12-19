import { type FC, Suspense } from 'react';
import Modal from 'shared/ui/Modal';
import lazyImport from 'shared/helpers/lazyImport';
import Loader from 'shared/ui/Loader';


interface ILoginModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

const LoginForm = lazyImport(() => import('../LoginForm/LoginForm'));
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
            <Suspense fallback={ <Loader /> }>
                <LoginForm onSuccess={ onClose } />
            </Suspense>
        </Modal>
    );
};

export default LoginModal;
