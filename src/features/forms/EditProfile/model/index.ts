import { type IProfile } from 'store/Profile';


export { default, editProfileActions } from './reducer/slice';
// export * from './selectors';
//
export interface IEditProfileSchema extends Partial<IProfile> {}
