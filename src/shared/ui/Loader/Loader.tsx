import { type FC, useEffect } from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Loader.module.scss';


interface ILoaderProps {
    className?: string;
}
const Loader: FC<ILoaderProps> = ({ className }) => {

    useEffect(() => {
        console.log('Loader');
    }, []);

    return (
        <div className={ _c(cls['loader'], [ className ]) } />
    );
};

export default Loader;
