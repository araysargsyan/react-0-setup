import {useTranslation} from "react-i18next";
import classNames from 'helpers/classNames';
import AppButton, {EAppButtonTheme} from "shared/ui/AppButton";
import cls from './LangSwitcher.module.scss';
import {FC} from "react";

interface LangSwitcherProps {
    className?: string;
}

const LangSwitcher: FC<LangSwitcherProps> = ({className}) => {
    const { t, i18n } = useTranslation();

    const toggle = async () => {
        await i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
    }

    return (
        <AppButton
            className={classNames(cls['lang-switcher'],[className])}
            theme={EAppButtonTheme.CLEAR}
            onClick={toggle}
        >
            {t('Language')}
        </AppButton>
    );
};

export default LangSwitcher;

