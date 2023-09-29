import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { getProfileData, getProfileReadonly } from 'store/Profile/selectors';
import _c from 'shared/helpers/classNames';
import {
    type FC, memo, useEffect, 
} from 'react';
import AppInput from 'shared/ui/AppInput';
import AppForm, { EFormComponent } from 'shared/ui/AppForm';
import { type TAsyncReducerOptions } from 'config/store';
import { getEditProfileData, getEditProfileField } from 'features/forms/EditProfile/model/selectors';
import { useDynamicActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import AppSelect from 'shared/ui/AppSelect';
import AppAvatar from 'shared/ui/AppAvatar';
import { CountrySelectOptions, type ECountry } from 'features/Country';
import { CurrencySelectOptions } from 'features/Currency';
import { type TAddAsyncReducerOp } from 'config/store/types';

import cls from './EditProfile.module.scss';
import { type TEditProfileActions } from '../model';


const asyncReducerOptions: TAddAsyncReducerOp = async () => {
    const editProfileReducer = (await import('../model')).default;

    return [ {
        key: editProfileReducer.name,
        reducer: editProfileReducer.reducer,
        parentKey: 'forms'
    } ];
};
export interface IEditProfileProps {
    className?: string;
}

const EditProfile: FC<IEditProfileProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const readonly = useSelector(getProfileReadonly);
    const data = useSelector(getProfileData, shallowEqual);

    const getAsyncAction = useDynamicActions<TEditProfileActions>(
        () => import('../model'),
        {
            when: !readonly,
            deps: [ readonly ],
            moduleKey: 'editProfileActions'
        }
    );

    useRenderWatcher(EditProfile.name, JSON.stringify({ ...data, readonly }));
    return (
        <AppForm
            state={ !readonly ? { forms: { editProfile: data } } : undefined }
            reducersOption={ !readonly ? asyncReducerOptions : undefined }
            formComponent={ EFormComponent.DIV }
            className={ _c(cls['edit-profile-form'],  [ className ]) }
        >
            <AppAvatar
                alt={ t('avatar') }
                className={ cls['avatar-wrapper'] }
                srcSelector={ getEditProfileField('avatar') }
            />
            <AppInput
                name="firsname"
                className={ cls.input }
                placeholder={ t('Ваше имя') }
                selector={ getEditProfileField('firstname') }
                onChange={ !readonly ? getAsyncAction('setFirstname') : undefined }
                readOnly={ readonly }
            />
            <AppInput
                name="lastname"
                className={ cls.input }
                placeholder={ t('Ваша фамилия') }
                selector={ getEditProfileField('lastname') }
                onChange={ !readonly ? getAsyncAction('setLastname') : undefined }
                readOnly={ readonly }
            />

            <AppInput
                name="age"
                className={ cls.input }
                placeholder={ t('Ваш возраст') }
                selector={ getEditProfileField('age') }
                onChange={ !readonly ? getAsyncAction('setAge') : undefined }
                readOnly={ readonly }
            />
            <AppInput
                name="city"
                className={ cls.input }
                placeholder={ t('Город') }
                selector={ getEditProfileField('city') }
                onChange={ !readonly ? getAsyncAction('setCity') : undefined  }
                readOnly={ readonly }
            />
            <AppInput
                name="username"
                className={ cls.input }
                placeholder={ t('Введите имя пользователя') }
                selector={ getEditProfileField('username') }
                onChange={ !readonly ? getAsyncAction('setUsername') : undefined  }
                readOnly={ readonly }
            />
            <AppInput
                name="avatar"
                className={ cls.input }
                placeholder={ t('Введите ссылку на аватар') }
                selector={ getEditProfileField('avatar') }
                onChange={ !readonly ? getAsyncAction('setAvatar') : undefined  }
                readOnly={ readonly }
            />
            <AppSelect
                name="currency"
                label={ t('Set currency') }
                className={ cls.input }
                options={ CurrencySelectOptions }
                selector={ getEditProfileField('currency') }
                onChange={ !readonly ? getAsyncAction('setCurrency') : undefined }
                readonly={ readonly }
            />
            <AppSelect<ECountry>
                name="currency"
                label={ t('Set currency') }
                className={ cls.input }
                options={ CountrySelectOptions }
                selector={ getEditProfileField('country') }
                onChange={ !readonly ? getAsyncAction('setCountry') : undefined }
                readonly={ readonly }
            />
        </AppForm>
    );
};

export default memo(EditProfile);
