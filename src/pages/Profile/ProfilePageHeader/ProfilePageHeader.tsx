import { type FC } from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useActions } from 'shared/hooks/redux';
import { profileActions, getProfileReadonly } from 'store/Profile';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import AppText from 'shared/ui/Text';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './ProfilePageHeader.module.scss';


interface IProfilePageHeaderProps {
    className?: string;
}

const ProfilePageHeader: FC<IProfilePageHeaderProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const readonly = useSelector(getProfileReadonly);
    const {
        setReadonly,
        cancelEdit,
        updateData
    } = useActions(profileActions, [ 'setReadonly', 'cancelEdit', 'updateData' ]);

    useRenderWatcher(ProfilePageHeader.name, JSON.stringify(readonly));
    return (
        <div className={ _c(cls['profile-page-header'], [ className ]) }>
            <AppText title={ t('Профиль') } />
            { readonly ? (
                <AppButton
                    className={ cls['edit-btn'] }
                    theme={ EAppButtonTheme.OUTLINE }
                    onClick={ setReadonly.bind(null, false) }
                >
                    { t('Редактировать') }
                </AppButton>
            ) : (
                <>
                    <AppButton
                        className={ cls['edit-btn'] }
                        theme={ EAppButtonTheme.OUTLINE_RED }
                        onClick={ cancelEdit.bind(null, undefined) }
                    >
                        { t('Отменить') }
                    </AppButton>
                    <AppButton
                        className={ cls['save-btn'] }
                        theme={ EAppButtonTheme.OUTLINE }
                        onClick={ updateData }
                    >
                        { t('Сохранить') }
                    </AppButton>
                </>
            ) }
        </div>
    );
};

export default ProfilePageHeader;
