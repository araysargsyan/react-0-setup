import { type useNavigate } from 'react-router-dom';
import until from 'app/dubag/util/wait';
import { ERoutes } from 'config/router';

import {
    auth, login, logout, noAuth
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
    public reset = () => {
        const waitingTime = 1000;

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
                return window.location.replace(ERoutes.TEST);
            }
            const original = {
                ...this[ 'useEffect: Update' ],
                calls: { ...this[ 'calls' ] }
            };
            const isAsAspect: boolean = localStorage.getItem('flowState') === JSON.stringify(original);
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
                        : type === 'logout' ? logout : null;
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
                    if (window.location.pathname !== ERoutes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(ERoutes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowState', JSON.stringify(object['NFRL']['NO_WAIT']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRL', 'NO_WAIT' ]));
                            this.navigate(object.paths['NFRL']['NO_WAIT']);
                        });
                    }
                } else if (this.checks[type]['NFRL->WAIT_AUTH'] === undefined) {
                    if (window.location.pathname !== ERoutes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(ERoutes.TEST);
                    } else {
                        until(waitingTime).then(() => {
                            localStorage.setItem('flowState', JSON.stringify(object['NFRL']['WAIT_AUTH']));
                            localStorage.setItem('flowStateMap', JSON.stringify([ type, 'NFRL', 'WAIT_AUTH' ]));
                            this.navigate(object.paths['NFRL']['WAIT_AUTH']);
                        });
                    }
                } else if (this.checks[type]['NFRL->WAIT_AUTH/REDIRECT'] === undefined) {
                    if (window.location.pathname !== ERoutes.TEST) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(ERoutes.TEST);
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
                    if (window.location.pathname !== ERoutes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${ERoutes.TEST}?rendered=false`);
                    } else if (window.location.pathname === ERoutes.TEST && window.location.search === '?rendered=false') {
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
                    if (window.location.pathname !== ERoutes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${ERoutes.TEST}?rendered=false`);
                    } else if (window.location.pathname === ERoutes.TEST && window.location.search === '?rendered=false') {
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
                    if (window.location.pathname !== ERoutes.TEST && !isRendered) {
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        window.location.replace(`${ERoutes.TEST}?rendered=false`);
                    } else if (window.location.pathname === ERoutes.TEST && window.location.search === '?rendered=false') {
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
                }  else if (!localStorage.getItem('user') && this.checks.auth === undefined) {
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
                debugger;

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
                    if (window.location.pathname !== object.config['RNFRL']['WAIT_AUTH'][type === 'login'? 'authorized' : 'unAuthorized'] && !rendered) {
                        localStorage.setItem('rendered', JSON.stringify(true));
                        localStorage.setItem('flowStateMap', JSON.stringify(type));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['WAIT_AUTH']));
                        window.location.replace(object.config['RNFRL']['WAIT_AUTH'][type === 'login'? 'authorized' : 'unAuthorized']);
                    } else {
                        (document.getElementById(type === 'login' ? logoutBtnId : loginBtnId))?.click();
                        until(waitingTime).then(() => {
                            if (window.location.pathname !== object.paths['RNFRL']['WAIT_AUTH']) {
                                localStorage.setItem('flowStateMap', JSON.stringify(type));
                                localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['WAIT_AUTH']));
                                this.navigate(object.paths['RNFRL']['WAIT_AUTH']);
                            } else {
                                localStorage.removeItem('rendered');
                                localStorage.setItem('flowStateMap', JSON.stringify([ type, 'RNFRL', 'WAIT_AUTH' ]));
                                localStorage.setItem('$authProtectionConfig', JSON.stringify(object.config['RNFRL']['WAIT_AUTH']));
                                localStorage.setItem('flowState', JSON.stringify(object['RNFRL']['WAIT_AUTH']));
                                (document.getElementById(type === 'login' ? loginBtnId : logoutBtnId))?.click();
                            }
                        });
                    }
                } else if (this.checks['login']['RNFRL->WAIT_AUTH'] && this.checks.logout === undefined) {
                    document.getElementById(loginBtnId)?.click();
                    until(waitingTime + 1000).then(() => {
                        localStorage.setItem('flowStateMap', JSON.stringify('logout'));
                        localStorage.setItem('$authProtectionConfig', JSON.stringify(logout.config['RFRL']['NO_WAIT']));
                        window.location.replace(logout.paths['RFRL']['NO_WAIT']);
                    });
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
