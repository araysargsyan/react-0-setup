import React from 'react';
import { useTranslation } from 'react-i18next';
import BugButton from 'app/dubag/ui/BugButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useAppSelector } from 'shared/hooks/redux';

 
function Main() {
    const { t } = useTranslation('main');
    const testData = useAppSelector(({ counter }) => counter.testData);

    useRenderWatcher(Main.name);
    return (
        <div>
            { t('Main page') }
            <BugButton />
            { JSON.stringify(testData) }
        </div>
    );
}

export default Main;
