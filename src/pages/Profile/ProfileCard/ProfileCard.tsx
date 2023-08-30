import { useSelector } from 'react-redux';
import _c from 'shared/helpers/classNames';
import {
    type FC, memo, Suspense 
} from 'react';
import ProfilePageHeader from 'pages/Profile/ProfilePageHeader';
import lazyImport from 'shared/helpers/lazyImport';
import Loader from 'shared/ui/Loader';
import { type IEditProfileProps } from 'features/forms/EditProfile';
import { isProfileFetched } from 'store/Profile';

import cls from './ProfileCard.module.scss';


interface IProfileCardProps {
    className?: string;
}
const EditProfile = lazyImport<FC<IEditProfileProps>>(() => {
    return import('features/forms/EditProfile');
});

const ProfileCard: FC<IProfileCardProps> = ({ className }) => {
    const isFetched = useSelector(isProfileFetched);



    return (
        <div className={ _c(cls['profile-card'],  [ className ]) }>
            <ProfilePageHeader />
            <Suspense fallback={ <Loader /> }>
                { isFetched ? <EditProfile /> : <Loader /> }
            </Suspense>
        </div>
    );
};

export default memo(ProfileCard);
