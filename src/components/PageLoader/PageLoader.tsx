import { type FC } from 'react';
import _c from 'shared/helpers/classNames';
import Loader from 'shared/ui/Loader/Loader';

import cls from './PageLoader.module.scss';


interface IPageLoaderProps {
    className?: string;
}
const PageLoader: FC<IPageLoaderProps> = ({ className }) => {

    return (
        <div className={ _c(cls['page-loader'], [ className ]) }>
            <Loader />
        </div>
    );
};

export default PageLoader;
