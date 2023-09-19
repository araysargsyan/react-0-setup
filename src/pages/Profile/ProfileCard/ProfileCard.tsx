import { useSelector } from 'react-redux';
import _c from 'shared/helpers/classNames';
import React, {
    type FC, memo, Suspense 
} from 'react';
import ProfilePageHeader from 'pages/Profile/ProfilePageHeader';
import EditProfile from 'features/forms/EditProfile';
import { getProfileError, getProfileIsLoading, } from 'store/Profile';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import AppText, { ETextAlign, ETextTheme } from 'shared/ui/Text';
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
                    theme={ ETextTheme.ERROR }
                    title={ t('Произошла ошибка при загрузке профиля') }
                    text={ t('Попробуйте обновить страницу') }
                    align={ ETextAlign.CENTER }
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
                    theme={ ETextTheme.ERROR }
                    title={ t('Произошла ошибка при загрузке профиля') }
                    text={ t('Попробуйте обновить страницу') }
                    align={ ETextAlign.CENTER }
                />
            </div>
        );
    }

    return (
        <div className={ _c(cls['profile-card'],  [ className ]) }>
            <ProfilePageHeader />
            <Suspense fallback={ <h1>EDIT PROFILE SKELETON</h1> }>
                <EditProfile />
            </Suspense>
        </div>
    );
};

export default memo(ProfileCard);
