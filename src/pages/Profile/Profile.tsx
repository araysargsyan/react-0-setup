import { AsyncReducer, type TAsyncReducerOptions } from 'config/store';
import { type FC, useEffect } from 'react';
import profile, { profileActions } from 'store/Profile';
import { useAppDispatch } from 'shared/hooks/redux';
import ProfileCard from 'features/forms/ProfileCard';


const asyncReducerOptions: TAsyncReducerOptions = {
    key: profile.name,
    reducer: profile.reducer,
};

interface IProfileProps {
    className?: string;
}

const Profile: FC<IProfileProps> = ({ className }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(profileActions.fetchData());
    }, [ dispatch ]);

    return (
        <AsyncReducer
            options={ asyncReducerOptions }
            removeAfterUnmount
        >
            <div className={ className }>
                <ProfileCard />
            </div>
        </AsyncReducer>
    );
};

export default Profile;
