import React from 'react';
import { useTranslation } from 'react-i18next';
import BugButton from 'app/dubag/ui/BugButton';

 
function Main() {
    const { t } = useTranslation('main');

    return (
        <div>
            { t('Main page') }
            <BugButton />
        </div>
    );
}

export default Main;
