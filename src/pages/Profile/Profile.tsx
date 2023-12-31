import { type FC } from 'react';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useTranslation } from 'react-i18next';
import Page from 'components/Page';

import ProfileCard from './ProfileCard';


interface IProfileProps {
    className?: string;
}

const Profile: FC<IProfileProps> = ({ className }) => {
    useTranslation('profile');

    useRenderWatcher(Profile.name);
    return (
        <Page>
            <ProfileCard className={ className } />
        </Page>
    );
};

export default Profile;
