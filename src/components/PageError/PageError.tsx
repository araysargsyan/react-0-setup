import { useTranslation } from 'react-i18next';
import classNames from 'helpers/classNames';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import { useNavigate } from 'react-router-dom';

import cls from './PageError.module.scss';


interface PageErrorProps {
    className?: string;
}

const PageError = ({ className }: PageErrorProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={ classNames(cls['page-error'], [ className ]) }>
            <p>{ t('Произошла непредвиденная ошибка') }</p>
            <AppButton
                onClick={ () => navigate(0) }
                theme={ EAppButtonTheme.CLEAR }
            >
                { t('Обновить страницу') }
            </AppButton>
        </div>
    );
};

export default PageError;
