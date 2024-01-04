import {
    type MutableRefObject, useCallback, useRef
} from 'react';


export default function useDebounce<
    T extends((...args: any[]) => any) = ((...args: any[]) => any)
>(callback: T, delay: number) {
    const timer = useRef() as MutableRefObject<any>;

    return useCallback((...args: any[]) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [ callback, delay ]);
}
