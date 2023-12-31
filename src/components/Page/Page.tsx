import {
    type FC, type MutableRefObject, type PropsWithChildren, useRef
} from 'react';
import _c from 'shared/helpers/classNames';
import useInfiniteScroll, { type IUseInfiniteScrollOptions } from 'shared/hooks/useInfiniteScroll';

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

    const infiniteScrollOptions: IUseInfiniteScrollOptions | null = onScrollEnd ? {
        callback: onScrollEnd,
        wrapperRef,
        triggerRef
    } : null;

    useInfiniteScroll(infiniteScrollOptions);

    if (!onScrollEnd) {
        return (
            <main className={ _c(cls['page'], [ className ]) }>
                { children }
            </main>
        );
    }

    return (
        <main
            ref={ wrapperRef }
            className={ _c(cls['page'], [ className ]) }
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
