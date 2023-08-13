import { type FC } from 'react';
import classNames from 'helpers/classNames';
import Loader from 'shared/ui/Loader/Loader';

import cls from './PageLoader.module.scss';


interface IPageLoaderProps {
    className?: string;
}
const PageLoader: FC<IPageLoaderProps> = ({ className }) => {

    return (
        <div className={ classNames(cls['page-loader'], [ className ]) }>
            <Loader />
        </div>
    );
};

export default PageLoader;
