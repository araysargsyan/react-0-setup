import { useTranslation } from 'react-i18next';
import { AsyncReducer, type TAsyncReducerOptions } from 'config/store';
import { type FC } from 'react';
import profile from 'store/Profile';


const asyncReducerOptions: TAsyncReducerOptions = {
    key: profile.name,
    reducer: profile.reducer,
    parentKey: 'forms'
};

interface ProfilePageProps {
    className?: string;
}

const ProfilePage: FC<ProfilePageProps> = ({ className }) => {
    const { t } = useTranslation();

    return (
        <AsyncReducer
            options={ asyncReducerOptions }
            removeAfterUnmount
        >
            <div className={ className }>
                { t('PROFILE PAGE') }
            </div>
        </AsyncReducer>
    );
};

export default ProfilePage;
