import {
    type FC,
    type MutableRefObject,
    type PropsWithChildren,
    type UIEventHandler,
    useLayoutEffect,
    useRef
} from 'react';
import _c from 'shared/helpers/classNames';
import useInfiniteScroll, { type IUseInfiniteScrollOptions } from 'shared/hooks/useInfiniteScroll';
import { UIActionCreators } from 'store/UI';
import { useActions } from 'shared/hooks/redux';
import { useLocation } from 'react-router-dom';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import useDebounce from 'shared/hooks/useDebounce';

import cls from './Page.module.scss';


interface IPageProps {
    className?: string;
    onScrollEnd?: IUseInfiniteScrollOptions['callback'];
}

const Page: FC<PropsWithChildren<IPageProps>> = ({
    className,
    onScrollEnd,
    children
}) => {
    const wrapperRef = useRef() as MutableRefObject<HTMLElement>;
    const triggerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const { pathname } = useLocation();
    const { setScrollPosition, getScrollPosition } = useActions(UIActionCreators, [ 'setScrollPosition', 'getScrollPosition' ]);

    const infiniteScrollOptions: IUseInfiniteScrollOptions | null = onScrollEnd ? {
        callback: onScrollEnd,
        wrapperRef,
        triggerRef
    } : null;
    useInfiniteScroll(infiniteScrollOptions);

    useLayoutEffect(() => {
        getScrollPosition(pathname).then((result) => {
            wrapperRef.current.scrollTop = result.payload || 0;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = useDebounce<UIEventHandler<HTMLDivElement>>((e) => {
        setScrollPosition({
            position: (e.target as typeof e.currentTarget).scrollTop,
            path: pathname,
        });
    }, 240);

    useRenderWatcher('Page', window.location.pathname);
    if (!onScrollEnd) {
        return (
            <main
                ref={ wrapperRef }
                className={ _c(cls['page'], [ className ]) }
            >
                { children }
            </main>
        );
    }

    return (
        <main
            ref={ wrapperRef }
            className={ _c(cls['page'], [ className ]) }
            onScroll={ onScroll }
        >
            { children }
            <div
                className={ cls.trigger }
                ref={ triggerRef }
            />
        </main>
    );
};

export default Page;
