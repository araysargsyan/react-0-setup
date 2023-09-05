import { type FC, memo } from 'react';
import _c from 'shared/helpers/classNames';
import Loader from 'shared/ui/Loader/Loader';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './PageLoader.module.scss';


interface IPageLoaderProps {
    className?: string;
}
const PageLoader: FC<IPageLoaderProps> = ({ className }) => {
    useRenderWatcher(PageLoader.name);
    return (
        <div className={ _c(cls['page-loader'], [ className ]) }>
            <Loader />
        </div>
    );
};

export default memo(PageLoader);
