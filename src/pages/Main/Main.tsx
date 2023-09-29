import React from 'react';
import { useTranslation } from 'react-i18next';
import BugButton from 'app/dubag/ui/BugButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useAppSelector } from 'shared/hooks/redux';
import { shallowEqual } from 'react-redux';

 
function Main() {
    const { t } = useTranslation('main');
    const testData = useAppSelector(({ counter }) => counter.testData, shallowEqual);
    const test = useAppSelector(({ counter }) => counter.value);

    useRenderWatcher(Main.name);
    return (
        <div>
            { t('Main page') }
            <BugButton />
            <h1>{ test }</h1>
        </div>
    );
}

export default Main;
