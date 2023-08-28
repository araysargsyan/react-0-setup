import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
    getProfileData, getProfileError, getProfileIsLoading 
} from 'store/Profile/selectors';
import _c from 'shared/helpers/classNames';
import { type FC } from 'react';
import AppText from 'shared/ui/Text';
import AppButton, { EAppButtonTheme } from 'shared/ui/AppButton';
import AppInput from 'shared/ui/AppInput';

import cls from './ProfileCard.module.scss';


interface IProfileCardProps {
    className?: string;
}

const ProfileCard: FC<IProfileCardProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const data = useSelector(getProfileData);
    const isLoading = useSelector(getProfileIsLoading);
    const error = useSelector(getProfileError);

    return (
        <div className={ _c(cls['profile-card'],  [ className ]) }>
            <div className={ cls.header }>
                <AppText title={ t('Профиль') } />
                <AppButton
                    className={ cls['edit-btn'] }
                    theme={ EAppButtonTheme.OUTLINE }
                >
                    { t('Редактировать') }
                </AppButton>
            </div>
            <div className={ cls.data }>
                <AppInput
                    name="firsname"
                    value={ data?.first }
                    placeholder={ t('Ваше имя') }
                    className={ cls.input }
                />
                <AppInput
                    name="lastname"
                    value={ data?.lastname }
                    placeholder={ t('Ваша фамилия') }
                    className={ cls.input }
                />
            </div>
        </div>
    );
};

export default ProfileCard;
