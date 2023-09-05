import React from 'react';
import { useTranslation } from 'react-i18next';
import BugButton from 'app/dubag/ui/BugButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

 
function Main() {
    const { t } = useTranslation('main');

    useRenderWatcher(Main.name);
    return (
        <div>
            { t('Main page') }
            <BugButton />
        </div>
    );
}

export default Main;
