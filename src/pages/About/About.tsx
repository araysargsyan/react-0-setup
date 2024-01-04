import { useTranslation } from 'react-i18next';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import Page from 'components/Page';


function About() {
    const { t } = useTranslation('about');

    useRenderWatcher(About.name);
    return (
        <Page>
            { t('About us') }
            <h2>{ t('About us') }</h2>
            <span>{ t('About us') }</span>
            <p>{ t('About us') }</p>
            <b>{ t('About us') }</b>
            <div>
                <h2>{ t('About us') }</h2>
                <span>{ t('About us') }</span>
                <p>{ t('About us') }</p>
                <b>{ t('About us') }</b>
            </div>
            <div>
                <h2>{ t('About us') }</h2>
                <span>{ t('About us') }</span>
                <p>{ t('About us') }</p>
                <b>{ t('About us') }</b>
            </div>
            <div>
                <h2>{ t('About us') }</h2>
                <span>{ t('About us') }</span>
                <p>{ t('About us') }</p>
                <b>{ t('About us') }</b>
            </div>
            <div>
                <h2>{ t('About us') }</h2>
                <span>{ t('About us') }</span>
                <p>{ t('About us') }</p>
                <b>{ t('About us') }</b>
            </div>
        </Page>
    );
}

export default About;
