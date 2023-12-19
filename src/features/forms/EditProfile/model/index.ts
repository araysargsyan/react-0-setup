import { type IProfile } from 'store/Profile';

import { editProfileActionCreators } from  './reducer/slice';


type TEditProfileActions = typeof editProfileActionCreators;
interface IEditProfileSchema extends Partial<IProfile> {}


export { default } from './reducer/slice';
export * from './selectors';

export {
    editProfileActionCreators,
    type TEditProfileActions,
    type IEditProfileSchema
};
