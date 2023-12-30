import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import Page from 'shared/ui/Page';

import cls from './NotFound.module.scss';


const NotFound: FC = () => {
    const { t } = useTranslation();

    useRenderWatcher(NotFound.name);
    return (
        <Page className={ cls['not-found'] }>
            { t('Page not found') }
        </Page>
    );
};

export default NotFound;
