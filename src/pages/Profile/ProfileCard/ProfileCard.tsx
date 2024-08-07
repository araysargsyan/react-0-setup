import { useSelector } from 'react-redux';
import _c from 'shared/helpers/classNames';
import React, { type FC, memo } from 'react';
import ProfilePageHeader from 'pages/Profile/ProfilePageHeader';
import EditProfile from 'features/forms/EditProfile';
import { getProfileError, getProfileIsLoading, } from 'store/Profile';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import AppText, { EAppTextAlign, EAppTextTheme } from 'shared/ui/Text';
import { useTranslation } from 'react-i18next';

import cls from './ProfileCard.module.scss';


interface IProfileCardProps {
    className?: string;
}

const ProfileCard: FC<IProfileCardProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const isLoading = useSelector(getProfileIsLoading);
    const error = useSelector(getProfileError);


    useRenderWatcher(ProfileCard.name, JSON.stringify({ isLoading, error, }));

    if (error) {
        return (
            <div className={ _c(cls['profile-card'],  [ className, cls.error ]) }>
                <AppText
                    theme={ EAppTextTheme.ERROR }
                    title={ t('Произошла ошибка при загрузке профиля') }
                    text={ t('Попробуйте обновить страницу') }
                    align={ EAppTextAlign.CENTER }
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={ _c(cls['profile-card'],  [ className ], { [cls.loading]: true }) }>
                <h1>Fetching Profile Data</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className={ _c(cls['profile-card'],  [ className, cls.error ]) }>
                <AppText
                    theme={ EAppTextTheme.ERROR }
                    title={ t('Произошла ошибка при загрузке профиля') }
                    text={ t('Попробуйте обновить страницу') }
                    align={ EAppTextAlign.CENTER }
                />
            </div>
        );
    }

    return (
        <div className={ _c(cls['profile-card'],  [ className ]) }>
            <ProfilePageHeader />
            <EditProfile />
        </div>
    );
};

export default memo(ProfileCard);
