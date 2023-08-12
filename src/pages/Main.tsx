import React from 'react';
import { useTranslation } from 'react-i18next';

 
function Main() {
    const { t } = useTranslation('main');

    return (
        <div>
            { t('Main page') }
        </div>
    );
}

export default Main;
