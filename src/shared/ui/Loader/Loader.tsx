import { type FC } from 'react';
import classNames from 'helpers/classNames';

import cls from './Loader.module.scss';


interface ILoaderProps {
    className?: string;
}
const Loader: FC<ILoaderProps> = ({ className }) => {

    return (
        <div className={ classNames(cls['loader'], [ className ]) }>

        </div>
    );
};

export default Loader;
