import { useTranslation } from 'react-i18next';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';


function About() { 
    const { t } = useTranslation('about');

    useRenderWatcher(About.name);
    return (
        <div>
            { t('About us') }
        </div>
    );
}

export default About;
