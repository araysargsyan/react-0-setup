import { type FC, useCallback } from 'react';
import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/hooks/redux';
import { profileActions, getProfileReadonly } from 'store/Profile';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import AppText from 'shared/ui/Text';

import cls from './ProfilePageHeader.module.scss';


interface IProfilePageHeaderProps {
    className?: string;
}

const ProfilePageHeader: FC<IProfilePageHeaderProps> = ({ className }) => {
    const { t } = useTranslation('profile');

    const readonly = useSelector(getProfileReadonly);
    const dispatch = useAppDispatch();

    const onEdit = useCallback(() => {
        dispatch(profileActions.setReadonly(false));
    }, [ dispatch ]);

    const onCancelEdit = useCallback(() => {
        dispatch(profileActions.cancelEdit());
    }, [ dispatch ]);

    const onSave = useCallback(() => {
        dispatch(profileActions.updateData());
    }, [ dispatch ]);

    return (
        <div className={ _c(cls['profile-page-header'], [ className ]) }>
            <AppText title={ t('Профиль') } />
            { readonly ? (
                <AppButton
                    className={ cls['edit-btn'] }
                    theme={ EAppButtonTheme.OUTLINE }
                    onClick={ onEdit }
                >
                    { t('Редактировать') }
                </AppButton>
            ) : (
                <>
                    <AppButton
                        className={ cls['edit-btn'] }
                        theme={ EAppButtonTheme.OUTLINE_RED }
                        onClick={ onCancelEdit }
                    >
                        { t('Отменить') }
                    </AppButton>
                    <AppButton
                        className={ cls['save-btn'] }
                        theme={ EAppButtonTheme.OUTLINE }
                        onClick={ onSave }
                    >
                        { t('Сохранить') }
                    </AppButton>
                </>
            ) }
        </div>
    );
};

export default ProfilePageHeader;
