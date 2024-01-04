import React from 'react';
import { useTranslation } from 'react-i18next';
import BugButton from 'app/dubag/ui/BugButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useAppSelector } from 'shared/hooks/redux';
import { shallowEqual } from 'react-redux';
import Page from 'components/Page';


function Main() {
    const { t } = useTranslation('main');
    const testData = useAppSelector(({ counter }) => counter.testData, shallowEqual) || { some: 0 };
    const test = useAppSelector(({ counter }) => counter.value);

    useRenderWatcher(Main.name);
    return (
        <Page>
            { t('Main page') }
            <BugButton />
            <BugButton />
            <BugButton />
            <BugButton />
            <h1>{ JSON.stringify(testData) }</h1>
            <h1>{ JSON.stringify(testData) }</h1>
            <h1>{ JSON.stringify(testData) }</h1>
            <div>{ test }</div>
            <p>{ test }</p>
            <a>{ test }</a>
            <div>
                <BugButton />
                <BugButton />
                <BugButton />
                <BugButton />
                <h1>{ test }</h1>
                <h1>{ test }</h1>
                <h1>{ test }</h1>
                <div>{ test }</div>
                <p>{ test }</p>
                <a>{ test }</a>
            </div>
        </Page>
    );
}

export default Main;
