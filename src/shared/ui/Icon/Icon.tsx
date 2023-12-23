import {
    memo,
    type FC,
    type SVGProps
} from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Icon.module.scss';


interface IIconProps {
    className?: string;
    Svg: FC<SVGProps<SVGSVGElement>>;
}

const Icon: FC<IIconProps> = ({  className, Svg  }) => {

    return (
        <Svg className={ _c(cls.icon,  [ className ]) } />
    );
};

export default memo(Icon);
