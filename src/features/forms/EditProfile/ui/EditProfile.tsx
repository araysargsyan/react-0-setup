import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getProfileData, getProfileReadonly } from 'store/Profile/selectors';
import _c from 'shared/helpers/classNames';
import { type FC, memo, } from 'react';
import AppInput from 'shared/ui/AppInput';
import AppForm, { EFormComponent } from 'shared/ui/AppForm';
import { type TAsyncReducerOptions } from 'config/store';
import { getEditProfileField } from 'features/forms/EditProfile/model/selectors';
import { useDynamicActions } from 'shared/hooks/redux';

import cls from './EditProfile.module.scss';
import { type TEditProfileActions } from '../model';


const asyncReducerOptions: TAsyncReducerOptions = async () => {
    const editProfileReducer = (await import('../model')).default;

    return {
        key: editProfileReducer.name,
        reducer: editProfileReducer.reducer,
        parentKey: 'forms'
    };
};
export interface IEditProfileProps {
    className?: string;
}

const EditProfile: FC<IEditProfileProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const readonly = useSelector(getProfileReadonly);
    const data = useSelector(getProfileData);

    const getAsyncAction = useDynamicActions<TEditProfileActions>(
        () => import('../model'),
        {
            when: !readonly,
            deps: [ readonly ],
            moduleKey: 'editProfileActions'
        }
    );


    return (
        <AppForm
            state={ !readonly ? { forms: { editProfile: data } } : undefined }
            reducersOption={ !readonly ? asyncReducerOptions : undefined }
            formComponent={ EFormComponent.DIV }
            className={ _c(cls.data,  [ className ]) }
        >
            <AppInput
                name="firsname"
                className={ cls.input }
                placeholder={ t('Ваше имя') }
                selector={ getEditProfileField('firstname') }
                onChange={ getAsyncAction('setFirstname')  }
                disabled={ readonly }
            />
            <AppInput
                name="lastname"
                className={ cls.input }
                placeholder={ t('Ваша фамилия') }
                selector={ getEditProfileField('lastname') }
                onChange={ getAsyncAction('setLastname')  }
                disabled={ readonly }
            />
        </AppForm>
    );
};

export default memo(EditProfile);
