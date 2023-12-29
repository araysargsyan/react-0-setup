import {
    useEffect,
    type MutableRefObject
} from 'react';


interface IUseInfiniteScrollOptions {
    callback: () => void;
    triggerRef: MutableRefObject<HTMLElement>;
    wrapperRef: MutableRefObject<HTMLElement>;
}

function useInfiniteScroll(infiniteScrollOptions: IUseInfiniteScrollOptions | null) {
    useEffect(() => {
        if (infiniteScrollOptions) {
            const {
                wrapperRef, triggerRef, callback
            } = infiniteScrollOptions;
            let observer: IntersectionObserver | null = null;
            const wrapperElement = wrapperRef.current;
            const triggerElement = triggerRef.current;

            const options = {
                root: wrapperElement,
                rootMargin: '0px',
                threshold: 1.0,
            };

            observer = new IntersectionObserver(([ entry ]) => {
                if (entry.isIntersecting) {
                    callback();
                }
            }, options);

            observer.observe(triggerElement);

            return () => {
                if (observer && triggerElement) {
                    observer.unobserve(triggerElement);
                }
            };
        }
    }, [ infiniteScrollOptions ]);
}

export type { IUseInfiniteScrollOptions };
export default useInfiniteScroll;
