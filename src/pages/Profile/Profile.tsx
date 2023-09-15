import { type FC } from 'react';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useTranslation } from 'react-i18next';

import ProfileCard from './ProfileCard';


interface IProfileProps {
    className?: string;
}

const Profile: FC<IProfileProps> = ({ className }) => {
    useTranslation('profile');

    useRenderWatcher(Profile.name);
    return (
        <div className={ className }>
            <ProfileCard />
        </div>
    );
};

export default Profile;
