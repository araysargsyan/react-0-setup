import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { getProfileData, getProfileReadonly } from 'store/Profile/selectors';
import _c from 'shared/helpers/classNames';
import {
    type FC, memo, Suspense, useCallback, useState,
} from 'react';
import AppInput from 'shared/ui/AppInput';
import AppForm, { EFormComponent } from 'shared/ui/AppForm';
import { getEditProfileField } from 'features/forms/EditProfile/model/selectors';
import { useActions, useDynamicActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import AppSelect from 'shared/ui/AppSelect';
import AppAvatar from 'shared/ui/AppAvatar';
import { CountrySelectOptions, type ECountry } from 'features/Country';
import { CurrencySelectOptions } from 'features/Currency';
import { type TAddAsyncReducerOp } from 'config/store/types';
import { profileActionCreators } from 'store/Profile';

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
interface IEditProfileProps {
    className?: string;
}

const EditProfile: FC<IEditProfileProps> = ({ className }) => {
    const { t } = useTranslation('profile');
    const data = useSelector(getProfileData, shallowEqual);
    const { updateData } = useActions(profileActionCreators, [ 'updateData' ]);
    const [ isFormLoaded, setIsFormLoaded ] = useState(false);
    const isReadonly = useSelector(getProfileReadonly);
    const getAsyncAction = useDynamicActions<TEditProfileActions>(
        () => import('../model'),
        {
            when: !isReadonly,
            deps: [ isReadonly ],
            moduleKey: 'editProfileActionCreators',
            // cb: () => setIsModuleLoaded(true)
        }
    );

    const EditProfileForm = useCallback(() => {
        const readonly = isReadonly || !isFormLoaded;
        return (
            <AppForm
                id={ 'edit-profile' }
                onSubmit={ updateData }
                afterLoad={ () => setIsFormLoaded(true) }
                state={ !isReadonly ? { forms: { editProfile: data } } : undefined }
                reducersOption={ !isReadonly ? asyncReducerOptions : undefined }
                formComponent={ !isReadonly ? EFormComponent.FORM : EFormComponent.DIV }
                className={ _c(cls['edit-profile-form'],  [ className ]) }
            >
                <AppAvatar
                    alt={ t('avatar') }
                    className={ cls['avatar-wrapper'] }
                    srcSelector={ getEditProfileField('avatar') }
                />
                <AppInput
                    mask={{
                        pattern: '##-##(##)',
                        // useMaskedValue: true
                    }}
                    name="firsname"
                    className={ cls.input }
                    placeholder={ t('Ваше имя') }
                    value={ getEditProfileField('firstname') }
                    onChange={ !readonly ? getAsyncAction('setFirstname') : undefined }
                    readOnly={ readonly }
                    autofocus
                />
                <AppInput
                    name="lastname"
                    className={ cls.input }
                    placeholder={ t('Ваша фамилия') }
                    value={ getEditProfileField('lastname') }
                    onChange={ !readonly ? getAsyncAction('setLastname') : undefined }
                    readOnly={ readonly }
                />

                <AppInput
                    name="age"
                    className={ cls.input }
                    placeholder={ t('Ваш возраст') }
                    value={ getEditProfileField('age') }
                    onChange={ !readonly ? getAsyncAction('setAge') : undefined }
                    readOnly={ readonly }
                />
                <AppInput
                    name="city"
                    className={ cls.input }
                    placeholder={ t('Город') }
                    value={ getEditProfileField('city') }
                    onChange={ !readonly ? getAsyncAction('setCity') : undefined  }
                    readOnly={ readonly }
                />
                <AppInput
                    name="username"
                    className={ cls.input }
                    placeholder={ t('Введите имя пользователя') }
                    value={ getEditProfileField('username') }
                    onChange={ !readonly ? getAsyncAction('setUsername') : undefined  }
                    readOnly={ readonly }
                />
                <AppInput
                    name="avatar"
                    className={ cls.input }
                    placeholder={ t('Введите ссылку на аватар') }
                    value={ getEditProfileField('avatar') }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data, isReadonly, isFormLoaded ]);

    useRenderWatcher(EditProfile.name, JSON.stringify({ ...data, isReadonly }));
    return (
        // <Suspense fallback={ <EditProfileForm /> }>
        <EditProfileForm />
        // </Suspense>
    );
};

export default memo(EditProfile);
