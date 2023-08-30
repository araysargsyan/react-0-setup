import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getProfileData, getProfileReadonly } from 'store/Profile/selectors';
import _c from 'shared/helpers/classNames';
import {
    type FC, memo, useCallback, useEffect, useRef
} from 'react';
import AppInput from 'shared/ui/AppInput';
import AppForm, { EFormComponent } from 'shared/ui/AppForm';
import { type TAsyncReducerOptions } from 'config/store';
import { getEditProfileField } from 'features/forms/EditProfile/model/selectors';
import { useAppDispatch } from 'shared/hooks/redux';
import { type ActionCreatorsMapObject } from '@reduxjs/toolkit';

import cls from './EditProfile.module.scss';


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
    const dispatch = useAppDispatch();
    const readonly = useSelector(getProfileReadonly);
    const data = useSelector(getProfileData);
    const actions = useRef<ActionCreatorsMapObject | null>(null);

    useEffect(() => {
        if (!readonly && !actions.current) {
            import('../model').then((data) => {
                actions.current = data.editProfileActions;
            });
        }
    }, [ readonly ]);


    const onChangeUsername = useCallback((value: string) => {
        const setFirstname = actions.current?.setFirstname;
        dispatch(setFirstname!(value));
    }, [ dispatch ]);

    const onChangeLastname = useCallback((value: string) => {
        const setLastname = actions.current?.setLastname;
        dispatch(setLastname!(value));
    }, [ dispatch ]);

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
                onChange={ onChangeUsername }
                disabled={ readonly }
            />
            <AppInput
                name="lastname"
                className={ cls.input }
                placeholder={ t('Ваша фамилия') }
                selector={ getEditProfileField('lastname') }
                onChange={ onChangeLastname }
                disabled={ readonly }
            />
        </AppForm>
    );
};

export default memo(EditProfile);
