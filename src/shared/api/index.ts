import axios, { type InternalAxiosRequestConfig } from 'axios';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';


const authReqInterceptor = (request: InternalAxiosRequestConfig) => {
    request.headers.authorization = `Bearer ${localStorage.getItem(USER_LOCALSTORAGE_KEY)}`;
    return request;
};
export const $api = axios.create({
    baseURL: __API__,
    headers: { authorization: localStorage.getItem(USER_LOCALSTORAGE_KEY) || '', },
});
$api.interceptors.request.use(authReqInterceptor);
