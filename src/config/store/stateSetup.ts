import { Routes, type TRoutes } from 'config/router';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { counterActionCreators } from 'store/Counter';
import { userActionCreators } from 'store/User';
import until from 'app/dubag/util/wait';
import { type TProfileActions } from 'store/Profile';
import { type TArticlesActionCreators } from 'store/Articles';

import {
    type TAsyncReducerOptions,
    type TCheckAuthorizationFn,
    type IStateSchema,
    createAsyncCb,
    createCb,
    createCanRefetch,
    createStateSetupConfig,
} from '.';


const StateSetupConfig = createStateSetupConfig<TRoutes, TAsyncReducerOptions<'cb'>>((searchParams) =>  {
    return {
        [Routes.ARTICLES]: {
            asyncReducerOptions: async () => {
                const articlesModule = await import('store/Articles');
                const articlesModuleName = articlesModule.default.name;

                return {
                    moduleNames: [ articlesModuleName ],
                    options: {
                        reducerOptions: [ {
                            key: articlesModuleName,
                            reducer: articlesModule.default.reducer,
                        } ]
                    },
                    actionCreators: { [articlesModuleName]: articlesModule.articlesActionCreators }
                };
            },
            actions: [
                {
                    cb: createAsyncCb<TArticlesActionCreators>(
                        'articles',
                        (articleActionCreators) => {
                            return articleActionCreators.init.bind(null, searchParams);
                        }
                    ),
                    canRefetch: true
                }
            ]
        },
        [Routes.ARTICLE_DETAILS]: {
            asyncReducerOptions: async (_) => {
                const articlesModule = await import('store/Articles');
                const articlesModuleName = articlesModule.default.name;

                return {
                    moduleNames: [ articlesModuleName ],
                    options: {
                        reducerOptions: [ {
                            key: articlesModuleName,
                            reducer: articlesModule.default.reducer,
                        } ]
                    },
                    actionCreators: { [articlesModuleName]: articlesModule.articlesActionCreators }
                };
            },
            actions: [
                {
                    cb: createAsyncCb<TArticlesActionCreators, {id: string}>(
                        'articles',
                        (articleActionCreators, { params }) => {
                            return articleActionCreators.fetchById.bind(null, params.id);
                        }
                    ),
                    async: true,
                    canRefetch: true
                },
            ],
        },
        [Routes.MAIN]: {
            authRequirement: null,
            actions: [
                {
                    actionCreator: counterActionCreators.fetchTest,
                    canRefetch: true,
                    async: true,
                },
                {
                    cb: createCb(({ pageNumber }) => {
                        return counterActionCreators.increment.bind(null, pageNumber);
                    }),
                    canRefetch: createCanRefetch<IStateSchema>((state) => {
                        return state.counter.value < 18;
                    }),
                },
            ],
            // onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
        [Routes.TEST]: {
            authRequirement: null,
            actions: [ //! if async is true this action call will wait in initial setup, by default false
                {
                    actionCreator: counterActionCreators.increment,
                    canRefetch: (state) => {
                        return (state as IStateSchema).counter.value < 18;
                    },
                },
            ],
        },
        [Routes.PROFILE]: {
            authRequirement: true,
            asyncReducerOptions: async (_) => {
                const profileModule = await import('store/Profile');
                const profileModuleName = profileModule.default.name;

                return {
                    moduleNames: [ profileModuleName ],
                    options: {
                        reducerOptions: [ {
                            key: profileModuleName,
                            reducer: profileModule.default.reducer,
                        } ],
                        state: { counter: { value: 4, testData: 'REPLACED TEST DATA' } }
                    },
                    actionCreators: { [profileModuleName]: profileModule.profileActionCreators }
                };
            },
            actions: [ //! async actions must be first
                {
                    cb: {
                        moduleKey: 'profile',
                        getAction: (profileActionCreators: any) => (profileActionCreators as TProfileActions).fetchData
                    },
                    async: true,
                    canRefetch: true
                },
                { actionCreator: counterActionCreators.decrement, canRefetch: true },
            ],
            onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
        [Routes.ABOUT]: {
            authRequirement: false,
            actions: [
                {
                    actionCreator: counterActionCreators.fetchTest,
                    canRefetch: true,
                    async: true,
                },
                { actionCreator: counterActionCreators.decrement, canRefetch: true },
                { actionCreator: counterActionCreators.increment },
                { actionCreator: counterActionCreators.increment },
                { actionCreator: counterActionCreators.increment },
            ],
            onNavigate: { waitUntil: 'CHECK_AUTH', }
        },
    };
});

export const checkAuthorization: TCheckAuthorizationFn = async (
    { isAuth },
    { dispatch }
) => {
    //! JWT EXAMPLE
    // if (localStorage.getItem(ETokens.ACCESS) && !getState().app.isAuthenticated) {
    //     await dispatch(appActionCreators.setIsAuthenticated(true, false));
    // }
    // if (!localStorage.getItem(ETokens.ACCESS) && this.isAuth === null) {
    //     try {
    //         const { user, accessToken } = await AuthService.refresh();
    //         localStorage.setItem(ETokens.ACCESS, accessToken);
    //         await dispatch(appActionCreators.setIsAuthenticated(true, false));
    //
    //     } catch (e) {
    //
    //     }
    // }

    // await until(1000);

    if (
        localStorage.getItem(USER_LOCALSTORAGE_KEY)
        //&& !getState().app.isAuthenticated
    ) {
        dispatch(userActionCreators.initAuthData());
        return true;
    }
    if (!localStorage.getItem(USER_LOCALSTORAGE_KEY) && isAuth === null) {
        return false;
        //! Not Authorized
    }
    return false;
};

export default StateSetupConfig;
