import { type FC } from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Loader.module.scss';


interface ILoaderProps {
    className?: string;
}
const Loader: FC<ILoaderProps> = ({ className }) => {

    return (
        <div className={ _c(cls['loader'], [ className ]) }>

        </div>
    );
};

export default Loader;
