import {
    type FC,
    type PropsWithChildren,
    type MouseEvent,
    useEffect,
    useState,
    useRef,
    useCallback
} from 'react';
import _c from 'shared/helpers/classNames';
import { useTheme } from 'app/providers/theme';
import Portal from 'shared/ui/Portal';

import cls from './Modal.module.scss';


interface IModalProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const ANIMATION_DELAY = 300;
const Modal: FC<PropsWithChildren<IModalProps>> = ({
    children,
    className,
    isOpen,
    onClose,
}) => {
    const [ isClosing, setIsClosing ] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const { theme } = useTheme();

    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timerRef.current = setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, ANIMATION_DELAY);
        }
    }, [ onClose ]);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeHandler();
        }
    }, [ closeHandler ]);

    const onContentClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
        }

        return () => {
            clearTimeout(timerRef.current);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [ isOpen, onKeyDown ]);

    const mods: Record<string, boolean> = {
        [cls.opened]: isOpen,
        [cls['is-closing']]: isClosing,
    };

    return (
        <Portal>
            <div className={ _c(cls['modal'], [ className ], mods) }>
                <div
                    className={ cls.overlay }
                    onClick={ closeHandler }
                >
                    <div
                        className={ cls.content }
                        onClick={ onContentClick }
                    >
                        { children }
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
