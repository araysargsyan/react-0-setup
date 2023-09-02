import { type IProfile } from 'store/Profile';

import { editProfileActions } from  './reducer/slice';


type TEditProfileActions = typeof editProfileActions;

export { default } from './reducer/slice';
export * from './selectors';
export interface IEditProfileSchema extends Partial<IProfile> {}

export {
    TEditProfileActions,
    editProfileActions
};
