import { type FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import _c from 'shared/helpers/classNames';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './LangSwitcher.module.scss';

 
interface LangSwitcherProps {
    className?: string;
    short?: boolean;
}

const LangSwitcher: FC<LangSwitcherProps> = ({ className, short }) => {
    const { t, i18n } = useTranslation();

    const toggle = async () => {
        await i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
    };


    useRenderWatcher(LangSwitcher.name, JSON.stringify({ short }));
    return (
        <AppButton
            className={ _c(cls['lang-switcher'], [ className ]) }
            theme={ EAppButtonTheme.CLEAR }
            onClick={ toggle }
        >
            { t(short ? 'Lang' : 'Language') }
        </AppButton>
    );
};

export default memo(LangSwitcher);

