import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import cls from './NotFound.module.scss';


const NotFound: FC = () => {
    const { t } = useTranslation();

    return (
        <div className={ cls['not-found'] }>
            { t('Page not found') }
        </div>
    );
};

export default NotFound;
