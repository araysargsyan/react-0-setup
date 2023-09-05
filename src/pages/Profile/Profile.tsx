import { type FC, useEffect } from 'react';
import { profileActions } from 'store/Profile';
import { useActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useTranslation } from 'react-i18next';

import ProfileCard from './ProfileCard';


interface IProfileProps {
    className?: string;
}

const Profile: FC<IProfileProps> = ({ className }) => {
    useTranslation('profile');
    const { fetchData } = useActions(profileActions, [ 'fetchData' ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    useRenderWatcher(Profile.name);
    return (
        <div className={ className }>
            <ProfileCard />
        </div>
    );
};

export default Profile;
