import { type IProfile } from 'store/Profile';

import { editProfileActions } from  './reducer/slice';


type TEditProfileActions = typeof editProfileActions;
interface IEditProfileSchema extends Partial<IProfile> {}


export { default } from './reducer/slice';
export * from './selectors';

export {
    TEditProfileActions,
    editProfileActions,
    IEditProfileSchema
};
