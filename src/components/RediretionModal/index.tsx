import { useEffect, useRef } from 'react';
import Portal from 'shared/ui/Portal';
import Modal from 'shared/ui/Modal';
import { createRedirectionModal } from 'config/store';


const RedirectionModal = createRedirectionModal(({ useContext }) => {
    const {
        show,
        context,
        closeRedirectionModal
    } = useContext();
    const isClosed = useRef(false);
    console.log('%c____RedirectModal_____', 'color:#0465cd', !show ? 'NULL' : 'MODAL', { show, context });

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                console.log('%c____RedirectModal_____', 'color:#0465cd', 'CLOSE', { show, context });
                isClosed.current = true;
                closeRedirectionModal();
            }, 3200);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ closeRedirectionModal, show ]);

    useEffect(() => {
        console.log('%c____RedirectModal_____: UPDATE', 'color:#0465cd', !show ? 'NULL' : 'MODAL', { show, context });
        // @ts-ignore
        const flowState = window.flowState;
        context?.type && flowState['useEffect: Update'].____RedirectModal_____.types.push(context.type as never);
        flowState['useEffect: Update'].____RedirectModal_____[!show ? 'NULL' : 'MODAL']
            = flowState['useEffect: Update'].____RedirectModal_____[!show ? 'NULL' : 'MODAL'] + 1;

        if (isClosed.current) {
            isClosed.current = false;
            console.log('$flowState', flowState.get());
            flowState.reset();
        }
    });

    if (!show) {
        return null;
    }

    return (
        <Portal>
            <Modal isOpen={ show }>
                <h1>REDIRECTING</h1>
                <h2>redirectTo: { context?.redirectTo }</h2>
                <h2>from: { context?.from }</h2>
                <h2>type: { context?.type }</h2>
                <h2>isPageLoaded: { String(context?.isPageLoaded) }</h2>
            </Modal>
        </Portal>
    );
});

export default RedirectionModal;
