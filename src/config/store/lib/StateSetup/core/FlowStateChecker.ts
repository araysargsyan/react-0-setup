import { type useNavigate } from 'react-router-dom';
import until from 'app/dubag/util/wait';
import { Routes } from 'shared/const';

import {
    auth, authExpired, login, logout, noAuth
} from './testScenarios';


export default class FlowStateChecker {
    private initialFlowState = {
        'useEffect: Update': {
            ____usePageStateSetUp____: 0,
            ____ProtectedElement_____: 0,
            ____LOADER_____: {
                SUSPENSE: 0,
                LOADING: 0
            },
            ____RedirectModal_____: {
                NULL: 0,
                MODAL: 0,
                types: []
            },
        },
        'calls': {
            'LOADING': 0,
            'SETUP': {
                count: 0,
                breakCount: 0
            },
            'SETUP_FIRST': {
                count: 0,
                breakCount: 0
            },
            'CHECK_AUTH': 0,
            'BREAK': 0
        }
    };
    public navigate!: ReturnType<typeof useNavigate>;
    public checks: any = { errors: [] };
    public 'calls'!: typeof this.initialFlowState['calls'];
    public 'useEffect: Update'!: typeof this.initialFlowState['useEffect: Update'];

    constructor() {
        this.checks = {
            ...this.checks,
            ...JSON.parse(localStorage.getItem('checks') || '{}')
        };
        this['calls'] = JSON.parse(JSON.stringify(this.initialFlowState['calls']));
        this['useEffect: Update'] = JSON.parse(JSON.stringify(this.initialFlowState['useEffect: Update']));
    }
    private deepEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true;
        }

        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }
    public removeCheckKey = (key: string, value?: string) => {
        this.checks.errors = [];
        if (value) {
            delete this.checks[key][value];
        } else {
            delete this.checks[key];
        }
        localStorage.setItem('checks', JSON.stringify(this.checks));
    };
    public reset = () => {
        if (!__IS_DEV__) {
            localStorage.removeItem('flowState');
            localStorage.removeItem('flowStateMap');
            localStorage.removeItem('$authProtectionConfig');
            this['calls'] = JSON.parse(JSON.stringify(this.initialFlowState['calls']));
            this['useEffect: Update'] = JSON.parse(JSON.stringify(this.initialFlowState['useEffect: Update']));
            return;
        }
        const waitingTime = 1200;

        if (window.location.pathname !== noAuth.paths.FRL['NO_WAIT']
            && this.checks?.noAuth?.['FRL->NO_WAIT'] === undefined
        ) {
            until(waitingTime).then(() => {
                localStorage.setItem('flowState', JSON.stringify(noAuth.FRL['NO_WAIT']));
                localStorage.setItem('flowStateMap', JSON.stringify([ 'noAuth', 'FRL', 'NO_WAIT' ]));
                window.location.replace(noAuth.paths.FRL['NO_WAIT']);
            });
        } else {
            if (window.location.pathname === noAuth.paths.FRL['NO_WAIT']
                && this.checks?.noAuth?.['FRL->NO_WAIT'] === undefined
                && !localStorage.getItem('flowState')
            ) {
                return window.location.replace(Routes.TEST);
            }
            const original = {
                ...this[ 'useEffect: Update' ],
                calls: { ...this[ 'calls' ] }
            };
            const isAsAspect: boolean = this.deepEqual(JSON.parse(localStorage.getItem('flowState') || '{}'), original);
            const flowStateMap: string[] | string = JSON.parse(localStorage.getItem('flowStateMap') || '[]');

            console.log('$__reset__$: INIT', {
                calls: { ...this[ 'calls' ] },
                LOCAL: JSON.parse(localStorage.getItem('flowState') || '{}'),
                ORIGINAL: original,
                checks: this.checks,
                flowStateMap,
                isAsAspect,
            });
            if (Array.isArray(flowStateMap) && flowStateMap.length) {
                this.checks[flowStateMap[0]] = {
                    ...this.checks?.[flowStateMap[0]],
                    [flowStateMap.filter((k) => k !== flowStateMap[0]).join('->')]: isAsAspect
                };
                if (!isAsAspect) {
                    this.checks.errors = [
                        ...this.checks.errors,
                        {
                            LOCAL: JSON.parse(localStorage.getItem('flowState') || '{}'),
                            ORIGINAL: original,
                            flowStateMap
                        }
                    ];
                }
                localStorage.setItem('checks', JSON.stringify(this.checks));

                console.log('$__reset__$: CHECKS', this.checks);
            }

            localStorage.removeItem('flowState');
            localStorage.removeItem('flowStateMap');
            localStorage.removeItem('$authProtectionConfig');
            this['calls'] = JSON.parse(JSON.stringify(this.initialFlowState['calls']));
            this['useEffect: Update'] = JSON.parse(JSON.stringify(this.initialFlowState['useEffect: Update']));

            const type = Array.isArray(flowStateMap) ? flowStateMap[0] : flowStateMap;
            const object: any = type === 'noAuth' ? noAuth
                : type === 'auth' ? auth
                    : type === 'login' ? login
                        : type === 'logout' ? logout
                            : type === 'authExpired' ? authExpired : null;
            console.log({ type, object });
            if ([ 'noAuth', 'auth' ].includes(type) && object) {
                if (this.checks[type]['FRL->WAIT_AUTH'] === undefined) {
                    until(waitingTime).then(() => {
                        localStorage.setItem('flowState', JSON.stringify(object['FRL']['WAIT_AUTH']));
                        localStorage.setItem('flowStateMap', JSON.stringify([ type, 'FRL', 'WAIT_AUTH' ]));
                        window.location.replace(object.paths['FRL']['WAIT_AUTH']);
                    });
                } else if (this.checks[type]['FRL->WAIT_AUTH/REDIRECT'] === undefined) {
                    until(waitingTime).then(() => {
                        localStorage.setItem('flowState', JSON.stringify(object['FRL']['WAIT_AUTH/REDIRECT']));
                        localStorage.setItem('flowStateMap', JSON.stringify([ type, 'FRL', 'WAIT_AUTH/REDIRECT' ]));
                        window.location.replace(object.paths['FRL']['WAIT_AUTH/REDIRECT']);
                    });
                } else if (this.checks[type]['NFRL->NO_WAIT'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(Routes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowState', JSON.stringify(object['NFRL']['NO_WAIT']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRL', 'NO_WAIT' ]));
                            this.navigate(object.paths['NFRL']['NO_WAIT']);
                        });
                    }
                } else if (this.checks[type]['NFRL->WAIT_AUTH'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(Routes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowState', JSON.stringify(object['NFRL']['WAIT_AUTH']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRL', 'WAIT_AUTH' ]));
                            this.navigate(object.paths['NFRL']['WAIT_AUTH']);
                        });
                    }
                } else if (this.checks[type]['NFRL->WAIT_AUTH/REDIRECT'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(Routes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowState', JSON.stringify(object['NFRL']['WAIT_AUTH/REDIRECT']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRL', 'WAIT_AUTH/REDIRECT' ]));
                            this.navigate(object.paths['NFRL']['WAIT_AUTH/REDIRECT']);
                        });
                    }
                } else if (this.checks[type]['NFRLL->NO_WAIT'] === undefined) {
                    const path = object.paths['NFRLL']['NO_WAIT'];
                    const isRendered = localStorage.getItem('rendered');
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${Routes.TEST}?rendered=false`);
                    } else if (window.location.pathname === Routes.TEST && window.location.search === '?rendered=false') {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify(type));
                            localStorage.setItem('rendered', JSON.stringify(true));
                            window.location.replace(path);
                        });
                    } else if (isRendered === 'true') {
                        until(waitingTime).then(() => {
                            localStorage.removeItem('rendered');
                            localStorage.setItem('flowState', JSON.stringify(object['NFRLL']['NO_WAIT']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRLL', 'NO_WAIT' ]));
                            this.navigate(path);
                        });
                    }
                } else if (this.checks[type]['NFRLL->WAIT_AUTH'] === undefined) {
                    const path = object.paths['NFRLL']['WAIT_AUTH'];
                    const isRendered = localStorage.getItem('rendered');
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${Routes.TEST}?rendered=false`);
                    } else if (window.location.pathname === Routes.TEST && window.location.search === '?rendered=false') {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify(type));
                            localStorage.setItem('rendered', JSON.stringify(true));
                            window.location.replace(path);
                        });
                    } else if (isRendered === 'true') {
                        until(waitingTime).then(() => {
                            localStorage.removeItem('rendered');
                            localStorage.setItem('flowState', JSON.stringify(object['NFRLL']['WAIT_AUTH']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRLL', 'WAIT_AUTH' ]));
                            this.navigate(path);
                        });
                    }
                } else if (this.checks[type]['NFRLL->WAIT_AUTH/REDIRECT'] === undefined) {
                    const path = object.paths['NFRLL']['WAIT_AUTH/REDIRECT'];
                    const isRendered = localStorage.getItem('rendered');
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${Routes.TEST}?rendered=false`);
                    } else if (window.location.pathname === Routes.TEST && window.location.search === '?rendered=false') {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify(type));
                            localStorage.setItem('rendered', JSON.stringify(true));
                            window.location.replace(path);
                        });
                    } else if (isRendered === 'true') {
                        until(waitingTime).then(() => {
                            localStorage.removeItem('rendered');
                            localStorage.setItem('flowState', JSON.stringify(object['NFRLL']['WAIT_AUTH/REDIRECT']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRLL', 'WAIT_AUTH/REDIRECT' ]));
                            this.navigate(path);
                        });
                    }
                } else if (!localStorage.getItem('user') && this.checks.auth === undefined) {
                    localStorage.setItem('user', JSON.stringify({
                        id: '1',
                        password: '123',
                        username: 'admin',
                    }));
                    localStorage.setItem('flowState', JSON.stringify(auth.FRL['NO_WAIT']));
                    localStorage.setItem('flowStateMap', JSON.stringify([ 'auth', 'FRL', 'NO_WAIT' ]));
                    window.location.replace(auth.paths.FRL['NO_WAIT']);
                } else if (localStorage.getItem('user') && this.checks.login === undefined) {
                    document.getElementById('SIGN_OUT')?.click();
                    until(waitingTime + 1000).then(() => {
                        localStorage.setItem('flowStateMap', JSON.stringify('login'));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(login.config['RFRL']['NO_WAIT']));
                        window.location.replace(login.paths['RFRL']['NO_WAIT']);
                    });
                }
            } else if ([ 'login', 'logout' ].includes(type) && object) {
                const loginBtnId = 'FAST_SIGN_IN';
                const logoutBtnId = 'SIGN_OUT';

                if (this.checks[type] === undefined) {
                    until(waitingTime).then(() => {
                        localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RFRL', 'NO_WAIT' ]));
                        localStorage.setItem('flowState', JSON.stringify(object['RFRL']['NO_WAIT']));
                        (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                    });
                } else if (this.checks[type]['RFRL->WAIT_AUTH'] === undefined) {
                    if (window.location.pathname !== object.paths['RFRL']['WAIT_AUTH']) {
                        (document.getElementById(type === 'login' ? logoutBtnId : loginBtnId))?.click();
                        until(waitingTime + 1000).then(() => {
                            localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RFRL']['WAIT_AUTH']));
                            localStorage.setItem('flowStateMap', JSON.stringify(type));
                            window.location.replace(object.paths['RFRL']['WAIT_AUTH']);
                        });
                    } else {
                        until(waitingTime + 1000).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RFRL', 'WAIT_AUTH' ]));
                            localStorage.setItem('flowState', JSON.stringify(object['RFRL']['WAIT_AUTH']));
                            (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                        });
                    }
                } else if (this.checks[type]['RNFRL->NO_WAIT'] === undefined) {
                    const rendered = localStorage.getItem('rendered');
                    if (window.location.pathname !== object.config['RNFRL']['NO_WAIT'][type === 'login'? 'authorized' : 'unAuthorized'] && !rendered) {
                        localStorage.setItem('rendered', JSON.stringify(true));
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['NO_WAIT']));
                        window.location.replace(object.config['RNFRL']['NO_WAIT'][type === 'login'? 'authorized' : 'unAuthorized']);
                    } else {
                        (document.getElementById(type === 'login' ? logoutBtnId : loginBtnId))?.click();
                        until(waitingTime).then(() => {
                            if (window.location.pathname !== object.paths['RNFRL']['NO_WAIT']) {
                                localStorage.setItem('flowStateMap', JSON.stringify(type));
                                localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['NO_WAIT']));
                                this.navigate(object.paths['RNFRL']['NO_WAIT']);
                            } else {
                                localStorage.removeItem('rendered');
                                localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RNFRL', 'NO_WAIT' ]));
                                localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['NO_WAIT']));
                                localStorage.setItem('flowState', JSON.stringify(object['RNFRL']['NO_WAIT']));
                                (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                            }
                        });
                    }
                } else if (this.checks[type]['RNFRL->WAIT_AUTH'] === undefined) {
                    const rendered = localStorage.getItem('rendered');
                    const redirectionPath = object.config['RNFRL']['WAIT_AUTH'][type === 'login'? 'authorized' : 'unAuthorized'];
                    if (window.location.pathname !== redirectionPath && !rendered) {
                        if (type === 'login') {
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                        } else {
                            localStorage.removeItem('user');
                        }
                        localStorage.setItem('rendered', JSON.stringify(true));
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['WAIT_AUTH']));
                        window.location.replace(redirectionPath);
                    } else {
                        until(waitingTime).then(() => {
                            (document.getElementById(type === 'login' ? logoutBtnId : loginBtnId))?.click();
                            until(waitingTime + 1000).then(() => {
                                this.navigate(Routes.TEST);
                                until(waitingTime + 1000).then(() => {
                                    this.navigate(object.paths['RNFRL']['WAIT_AUTH']);
                                    until(waitingTime + 1000).then(() => {
                                        localStorage.removeItem('rendered');
                                        localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RNFRL', 'WAIT_AUTH' ]));
                                        localStorage.setItem('flowState', JSON.stringify(object['RNFRL']['WAIT_AUTH']));
                                        localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['WAIT_AUTH']));
                                        (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                                    });
                                });
                            });
                        //     until(waitingTime).then(() => {
                        //         console.log(window.location.pathname, 'AAAAAA');
                        //         if (window.location.pathname !== object.paths['RNFRL']['WAIT_AUTH']) {
                        //             // if (type === 'login') {
                        //             //     localStorage.removeItem('user');
                        //             // } else {
                        //             //     localStorage.setItem('user', JSON.stringify({
                        //             //         id: '1',
                        //             //         password: '123',
                        //             //         username: 'admin',
                        //             //     }));
                        //             // }
                        //             localStorage.setItem('flowStateMap', JSON.stringify(type));
                        //             this.navigate(object.paths['RNFRL']['WAIT_AUTH']);
                        //         } else {
                        //             localStorage.removeItem('rendered');
                        //             localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RNFRL', 'WAIT_AUTH' ]));
                        //             localStorage.setItem('flowState', JSON.stringify(object['RNFRL']['WAIT_AUTH']));
                        //             (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                        //         }
                        //     });
                        });
                    }
                } else if (this.checks[type]['NR'] === undefined) {
                    document.getElementById(type === 'login' ? logoutBtnId : loginBtnId)?.click();
                    until(waitingTime).then(() => {
                        if (window.location.pathname !== Routes.TEST) {
                            localStorage.setItem('flowStateMap', JSON.stringify(type));
                            window.location.replace(Routes.TEST);
                        } else {
                            localStorage.setItem('flowState', JSON.stringify({
                                ...this.initialFlowState['useEffect: Update'],
                                calls: { ...this.initialFlowState['calls'] }
                            }));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NR' ]));
                            document.getElementById(type === 'login' ? loginBtnId : logoutBtnId)?.click();
                        }
                    });
                } else if (this.checks.login?.['NR'] && this.checks.logout === undefined) {
                    until(waitingTime).then(() => {
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        localStorage.setItem('flowStateMap', JSON.stringify('logout'));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(logout.config['RFRL']['NO_WAIT']));
                        window.location.replace(logout.paths['RFRL']['NO_WAIT']);
                    });
                } else if (this.checks.logout?.['NR'] && !localStorage.getItem('rendered')) {
                    localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                    localStorage.setItem('user', JSON.stringify({
                        id: '1',
                        password: '123',
                        username: 'admin',
                    }));
                    window.location.replace(Routes.TEST);
                }
            } else if (type === 'authExpired' && object) {
                const clearLocalStorageBtnId = 'CLEAR_STORAGE';
                const isRendered = localStorage.getItem('rendered');
                if (this.checks[type]?.['NRPFRL->NO_WAIT'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        window.location.replace(Routes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            document.getElementById(clearLocalStorageBtnId)?.click();
                            localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPFRL', 'NO_WAIT' ]));
                            localStorage.setItem('flowState', JSON.stringify(object.NRPFRL['NO_WAIT']));
                            this.navigate(object.paths.NRPFRL['NO_WAIT']);
                        });
                    }
                } else if (this.checks[type]?.['NRPFRL->WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                            window.location.replace(Routes.TEST);
                        });
                    } else {
                        until(waitingTime).then(() => {
                            document.getElementById(clearLocalStorageBtnId)?.click();
                            localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPFRL', 'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER' ]));
                            localStorage.setItem('flowState', JSON.stringify(object.NRPFRL['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER']));
                            this.navigate(object.paths.NRPFRL['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER']);
                        });
                    }
                } else if (this.checks[type]?.['NRPFRL->WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                            localStorage.setItem('rendered', JSON.stringify(true));
                            window.location.replace(Routes.TEST);
                        });
                    } else {
                        if (window.location.pathname !== '/') {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            this.navigate('/');
                        } else {
                            until(waitingTime).then(() => {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPFRL', 'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object.NRPFRL['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER']));
                                this.navigate(object.paths.NRPFRL['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER']);
                            });
                        }
                    }
                } else if (this.checks[type]?.['NRPNFRL->NO_WAIT'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                            localStorage.setItem('rendered', JSON.stringify(false));
                            window.location.replace(Routes.TEST);
                        });
                    } else {
                        until(waitingTime).then(() => {
                            if (window.location.pathname !== object.paths['NRPNFRL']['NO_WAIT'] && isRendered === 'false') {
                                localStorage.setItem('rendered', JSON.stringify(true));
                                localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                this.navigate(object.paths['NRPNFRL']['NO_WAIT']);
                            } else {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPNFRL', 'NO_WAIT' ]));
                                localStorage.setItem('flowState', JSON.stringify(object.NRPNFRL['NO_WAIT']));
                                this.navigate(object.paths.NRPNFRL['NO_WAIT']);
                            }
                        });
                    }
                } else if (this.checks[type]?.['NRPNFRL->WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                            localStorage.setItem('rendered', JSON.stringify(false));
                            window.location.replace(Routes.TEST);
                        });
                    } else if (window.location.pathname !== Routes.TEST && isRendered === 'true') {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            this.navigate(Routes.TEST);
                        });
                    } else {
                        until(waitingTime).then(() => {
                            if (window.location.pathname !== object.paths['NRPNFRL']['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER'] && isRendered === 'false') {
                                localStorage.setItem('rendered', JSON.stringify(true));
                                localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                this.navigate(object.paths['NRPNFRL']['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER']);
                            } else {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPNFRL', 'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object.NRPNFRL['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER']));
                                this.navigate(object.paths.NRPNFRL['WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER']);
                            }
                        });
                    }
                } else if (this.checks[type]?.['NRPNFRL->WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            localStorage.setItem('user', JSON.stringify({
                                id: '1',
                                password: '123',
                                username: 'admin',
                            }));
                            localStorage.setItem('rendered', JSON.stringify(false));
                            window.location.replace(Routes.TEST);
                        });
                    } else if (window.location.pathname !== Routes.TEST && isRendered === 'true') {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                            this.navigate(Routes.TEST);
                        });
                    } else {
                        until(waitingTime).then(() => {
                            if (window.location.pathname !== object.paths['NRPNFRL']['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER'] && isRendered === 'false') {
                                this.navigate(object.paths['NRPNFRL']['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER']);
                                until(waitingTime).then(() => {
                                    localStorage.setItem('rendered', JSON.stringify(true));
                                    localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                    this.navigate('/');
                                });
                            } else if (isRendered === 'true') {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ 'authExpired', 'NRPNFRL', 'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object.NRPNFRL['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER']));
                                this.navigate(object.paths.NRPNFRL['WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER']);
                            }
                        });
                    }
                } else if (this.checks[type]?.['RPFRL->REDIRECTED_PAGE_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST) {
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                        window.location.replace(Routes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            document.getElementById(clearLocalStorageBtnId)?.click();
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RPFRL', 'REDIRECTED_PAGE_FIRST_RENDER' ]));
                            localStorage.setItem('flowState', JSON.stringify(object['RPFRL']['REDIRECTED_PAGE_FIRST_RENDER']));
                            this.navigate(object.paths['RPFRL']['REDIRECTED_PAGE_FIRST_RENDER']);
                        });
                    }
                } else if (this.checks[type]?.['RPFRL->REDIRECTED_PAGE_NOT_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                        window.location.replace(Routes.TEST);
                    } else {
                        if (!isRendered) {
                            until(waitingTime).then(() => {
                                this.navigate(object.paths['RPFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']);
                                until(waitingTime + 1000).then(() => {
                                    localStorage.setItem('rendered', JSON.stringify('true'));
                                    localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                    this.navigate(Routes.TEST);
                                });
                            });
                        } else {
                            until(waitingTime).then(() => {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RPFRL', 'REDIRECTED_PAGE_NOT_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object['RPFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']));
                                this.navigate(object.paths['RPFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']);
                            });
                        }
                    }
                } else if (this.checks[type]?.['RPNFRL->REDIRECTED_PAGE_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                        window.location.replace(Routes.TEST);
                    } else {
                        if (!isRendered) {
                            until(waitingTime).then(() => {
                                this.navigate('/');
                                until(waitingTime + 1000).then(() => {
                                    localStorage.setItem('rendered', JSON.stringify('true'));
                                    localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                    this.navigate(Routes.TEST);
                                });
                            });
                        } else {
                            until(waitingTime).then(() => {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RPNFRL', 'REDIRECTED_PAGE_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object['RPNFRL']['REDIRECTED_PAGE_FIRST_RENDER']));
                                this.navigate(object.paths['RPNFRL']['REDIRECTED_PAGE_FIRST_RENDER']);
                            });
                        }
                    }
                } else if (this.checks[type]?.['RPNFRL->REDIRECTED_PAGE_NOT_FIRST_RENDER'] === undefined) {
                    if (window.location.pathname !== Routes.TEST && !isRendered) {
                        localStorage.setItem('user', JSON.stringify({
                            id: '1',
                            password: '123',
                            username: 'admin',
                        }));
                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                        window.location.replace(Routes.TEST);
                    } else {
                        if (!isRendered) {
                            until(waitingTime).then(() => {
                                this.navigate('/');
                                until(waitingTime + 1000).then(() => {
                                    this.navigate(object.paths['RPNFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']);
                                    until(waitingTime + 1000).then(() => {
                                        localStorage.setItem('rendered', JSON.stringify('true'));
                                        localStorage.setItem('flowStateMap', JSON.stringify('authExpired'));
                                        this.navigate(Routes.TEST);
                                    });
                                });
                            });
                        } else {
                            until(waitingTime).then(() => {
                                localStorage.removeItem('rendered');
                                document.getElementById(clearLocalStorageBtnId)?.click();
                                localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RPNFRL', 'REDIRECTED_PAGE_NOT_FIRST_RENDER' ]));
                                localStorage.setItem('flowState', JSON.stringify(object['RPNFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']));
                                this.navigate(object.paths['RPNFRL']['REDIRECTED_PAGE_NOT_FIRST_RENDER']);
                            });
                        }
                    }
                }
            }
        }
    };

    public get = () => {
        return JSON.parse(JSON.stringify({
            ['calls']: this['calls'],
            ['useEffect: Update']: this['useEffect: Update']
        }));
    };
}
