/* eslint-disable import/exports-last */
//UPDATE SCENARIOS

export const noAuth = {
    paths: {
        //! FIRST_RENDER(LAZY)
        FRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/about',
            'WAIT_AUTH/REDIRECT': '/profile',
        },
        //! NOT_FIRST_RENDER(LAZY)
        NFRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/about',
            'WAIT_AUTH/REDIRECT': '/profile',
        },
        //! NOT_FIRST_RENDER_LOADED(LAZY)
        NFRLL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/about',
            'WAIT_AUTH/REDIRECT': '/profile',
        }
    },
    FRL: {
        'NO_WAIT': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    count: 0,
                    breakCount: 0
                },
                'SETUP_FIRST': {
                    count: 1,
                    breakCount: 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 2 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 2, MODAL: 1, types: [ 'FIRST_RENDER' ]
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        },
    },
    NFRL: {
        'NO_WAIT': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 2 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'NOT_FIRST_RENDER' ]
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
    },
    NFRLL: {
        'NO_WAIT': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 0,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            },
            calls: {
                'LOADING': 0,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'NOT_FIRST_RENDER' ]
            },
            calls: {
                'LOADING': 0,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 0,
                'BREAK': 0
            }
        },
    }
};

export const auth = {
    paths: {
        //! FIRST_RENDER(LAZY)
        FRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/profile',
            'WAIT_AUTH/REDIRECT': '/about',
        },
        //! NOT_FIRST_RENDER(LAZY)
        NFRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/profile',
            'WAIT_AUTH/REDIRECT': '/about',
        },
        //! NOT_FIRST_RENDER_LOADED(LAZY)
        NFRLL: {
            'NO_WAIT': '/',
            'WAIT_AUTH': '/profile',
            'WAIT_AUTH/REDIRECT': '/about',
        }
    },
    FRL: {
        'NO_WAIT': JSON.parse(JSON.stringify(noAuth.FRL['NO_WAIT'])),
        'WAIT_AUTH': {
            ...JSON.parse(JSON.stringify(noAuth.FRL['WAIT_AUTH'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.FRL['WAIT_AUTH'].calls)),
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ...JSON.parse(JSON.stringify(noAuth.FRL['WAIT_AUTH/REDIRECT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.FRL['WAIT_AUTH/REDIRECT'].calls)),
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        },
    },
    NFRL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRL['NO_WAIT'].calls)),
                'CHECK_AUTH': 1
            }
        },
        'WAIT_AUTH': {
            ...JSON.parse(JSON.stringify(noAuth.NFRL['WAIT_AUTH'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRL['WAIT_AUTH'].calls)),
                'CHECK_AUTH': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRL['WAIT_AUTH/REDIRECT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRL['WAIT_AUTH/REDIRECT'].calls)),
                'CHECK_AUTH': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        }
    },
    NFRLL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRLL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRLL['NO_WAIT'].calls)),
                'CHECK_AUTH': 1
            }
        },
        'WAIT_AUTH': {
            ...JSON.parse(JSON.stringify(noAuth.NFRLL['WAIT_AUTH'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRLL['WAIT_AUTH'].calls)),
                'CHECK_AUTH': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRLL['WAIT_AUTH/REDIRECT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRLL['WAIT_AUTH/REDIRECT'].calls)),
                'CHECK_AUTH': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
            }
        }
    },
};

export const login = {
    config: {
        //! REDIRECT_FIRST_RENDER(LAZY)
        RFRL: {
            'NO_WAIT': { authorized: '/' },
            'WAIT_AUTH': { authorized: '/profile' }
        },
        //! REDIRECT_NOT_FIRST_RENDER(LAZY)
        RNFRL: {
            'NO_WAIT': { authorized: '/' },
            'WAIT_AUTH': { authorized: '/profile' }
        }
    },
    paths: {
        RFRL: {
            'NO_WAIT': '/about',
            'WAIT_AUTH': '/about'
        },
        RNFRL: {
            'NO_WAIT': '/about',
            'WAIT_AUTH': '/about'
        }
    },
    RFRL: {
        'NO_WAIT': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
            },
            calls: {
                'LOADING': 1,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        }
    },
    RNFRL: {
        'NO_WAIT': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
            },
            calls: {
                'LOADING': 0,
                'SETUP': {
                    'count': 0,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 1,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
            },
            calls: {
                'LOADING': 0,
                'SETUP': {
                    'count': 1,
                    'breakCount': 0
                },
                'SETUP_FIRST': {
                    'count': 0,
                    'breakCount': 0
                },
                'CHECK_AUTH': 1,
                'BREAK': 0
            }
        }
    },
    NR: '__ZERO__'
};

export const logout = {
    config: {
        RFRL: {
            'NO_WAIT': { unAuthorized: '/' },
            'WAIT_AUTH': { unAuthorized: '/about2' }
        },
        RNFRL: {
            'NO_WAIT': { unAuthorized: '/' },
            'WAIT_AUTH': { unAuthorized: '/about2' }
        }
    },
    paths: {
        RFRL: {
            'NO_WAIT': '/profile',
            'WAIT_AUTH': '/profile'
        },
        RNFRL: {
            'NO_WAIT': '/profile',
            'WAIT_AUTH': '/profile'
        }
    },
    RFRL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(login.RFRL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(login.RFRL['NO_WAIT'].calls)),
                'CHECK_AUTH': 0
            }
        },
        'WAIT_AUTH': {
            ...JSON.parse(JSON.stringify(login.RFRL['WAIT_AUTH'])),
            calls: {
                ...JSON.parse(JSON.stringify(login.RFRL['WAIT_AUTH'].calls)),
                'CHECK_AUTH': 0,
                'SETUP': { count: 0, breakCount: 0 },
                'SETUP_FIRST': { count: 1, breakCount: 0 }
            }
        }
    },
    RNFRL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(login.RNFRL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(login.RNFRL['NO_WAIT'].calls)),
                'CHECK_AUTH': 0,
            }
        },
        'WAIT_AUTH': {
            ...JSON.parse(JSON.stringify(login.RNFRL['WAIT_AUTH'])),
            calls: {
                ...JSON.parse(JSON.stringify(login.RNFRL['WAIT_AUTH'].calls)),
                'CHECK_AUTH': 0,
                'SETUP': { count: 0, breakCount: 0 },
                'SETUP_FIRST': { count: 1, breakCount: 0 }
            }
        }
    },
    NR: '__ZERO__'
};

const noRedirectCaseBaseOptions = {
    ____usePageStateSetUp____: 2,
    ____ProtectedElement_____: 2,
    ____RedirectModal_____: {
        NULL: 1,
        MODAL: 1,
        types: [
            'AUTH_EXPIRED'
        ]
    },
    calls: {
        'LOADING': 1,
        'SETUP': {
            'count': 1,
            'breakCount': 0
        },
        'SETUP_FIRST': {
            'count': 0,
            'breakCount': 0
        },
        'CHECK_AUTH': 1,
        'BREAK': 0
    }
};
const redirectCaseBaseOptions = {
    ____usePageStateSetUp____: 3,
    ____ProtectedElement_____: 3,
    ____RedirectModal_____: {
        NULL: 1,
        MODAL: 1,
        types: [
            'AUTH_EXPIRED'
        ]
    },
    calls: {
        'LOADING': 1,
        'SETUP': {
            'count': 1,
            'breakCount': 0
        },
        'SETUP_FIRST': {
            'count': 0,
            'breakCount': 0
        },
        'CHECK_AUTH': 1,
        'BREAK': 0
    }
};
//! ON_NAVIGATE
export const authExpired = {
    paths: {
        //! NO_REDIRECT_PAGE_FIRST_RENDER_LAZY
        NRPFRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER': '/profile',
            'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER': '/profile'
        },
        //! NO_REDIRECT_PAGE_NOT_FIRST_RENDER_LAZY
        NRPNFRL: {
            'NO_WAIT': '/',
            'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER': '/profile',
            'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER': '/profile'
        },
        //! REDIRECT_PAGE_FIRST_RENDER_LAZY
        RPFRL: {
            'REDIRECTED_PAGE_FIRST_RENDER': '/about',
            'REDIRECTED_PAGE_NOT_FIRST_RENDER': '/about',
        },
        //! REDIRECT_PAGE_NOT_FIRST_RENDER_LAZY
        RPNFRL: {
            'REDIRECTED_PAGE_FIRST_RENDER': '/about',
            'REDIRECTED_PAGE_NOT_FIRST_RENDER': '/about',
        }
    },
    //! NAVIGATE TO -> ANY_NO_REDIRECT_PAGE
    //! (PAGE MUST BE REDIRECTED WHEN NAVIGATE TO PROTECTED_PAGE
    //! AND THERE ARE 2 SCENARIOS WHEN REDIRECTION PAGE IS LOADED OR NOT)
    //! ['NRPFRL', 'NRPNFRL']
    NRPFRL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRL['NO_WAIT'].calls)),
                'CHECK_AUTH': 1
            }
        },
        'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(noRedirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 2, LOADING: 3 },
        },
        'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(noRedirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 1, LOADING: 2 },
        },
    },
    NRPNFRL: {
        'NO_WAIT': {
            ...JSON.parse(JSON.stringify(noAuth.NFRLL['NO_WAIT'])),
            calls: {
                ...JSON.parse(JSON.stringify(noAuth.NFRLL['NO_WAIT'].calls)),
                'CHECK_AUTH': 1
            }
        },
        'WAIT_AUTH/REDIRECTION_PAGE_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(noRedirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 1, LOADING: 0 },
        },
        'WAIT_AUTH/REDIRECTION_PAGE_NOT_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(noRedirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            calls: {
                ...JSON.parse(JSON.stringify(noRedirectCaseBaseOptions.calls)),
                'LOADING': 0
            }
        },
    },
    //! NAVIGATE TO -> ANY_REDIRECT_PAGE
    //! (PAGE MUST BE REDIRECTED TO PROTECTED_PAGE THEN MUST REDIRECT TO NOT_PROTECTED_PAGE
    //! AND THERE ARE 4 SCENARIOS, WHEN PROTECTED_PAGE, NOT_PROTECTED_PAGE ARE LOADED OR NOT)
    //! ['RPFRL', 'RPNFRL']
    RPFRL: {
        'REDIRECTED_PAGE_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(redirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 2, LOADING: 4 },
        },
        'REDIRECTED_PAGE_NOT_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(redirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 1, LOADING: 0 },
        },
    },
    RPNFRL: {
        'REDIRECTED_PAGE_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(redirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
        },
        'REDIRECTED_PAGE_NOT_FIRST_RENDER': {
            ...JSON.parse(JSON.stringify(redirectCaseBaseOptions)),
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            calls: {
                ...JSON.parse(JSON.stringify(redirectCaseBaseOptions.calls)),
                'LOADING': 0
            }
        },
    }
};
//! AUTH_EXPIRED +$
    //! NAVIGATE TO -> ANY_NO_REDIRECT_PAGE
    //! (PAGE MUST BE REDIRECTED WHEN NAVIGATE TO PROTECTED_PAGE
    //! AND THERE ARE 2 SCENARIOS WHEN REDIRECTION PAGE IS LOADED OR NOT)
    //? FIRST_RENDER
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1
            //* ____RedirectModal_____: NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: {LOADING=3, SUSPENSE=2} | {LOADING=2, SUSPENSE=1}
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //? NOT_FIRST_RENDER
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: 0,
            //* ____RedirectModal_____: 0
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: SUSPENSE=1 | 0
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //! NAVIGATE TO -> ANY_REDIRECT_PAGE
    //! (PAGE MUST BE REDIRECTED TO PROTECTED_PAGE THEN MUST REDIRECT TO NOT_PROTECTED_PAGE
    //! AND THERE ARE 4 SCENARIOS, WHEN PROTECTED_PAGE, NOT_PROTECTED_PAGE ARE LOADED OR NOT)
        //? WAIT_AUTH(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 3,
            //* ____ProtectedElement_____: 3,
            //* ____LOADER_____: 0 | {SUSPENSE: 1, LOADING: 3} | {SUSPENSE: 2, LOADING: 4} | {SUSPENSE: 1, LOADING: 0}
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }

//! BREAKING_FLOW
    //! AUTH
        //! UNTIL_CHECK_AUTH
            //? WAIT_AUTH(LAZY) -> NO_WAIT(LAZY)
                //* {
                //* ____usePageStateSetUp____: 2,
                //* ____ProtectedElement_____: 2,
                //* ____LOADER_____: {LOADING=3, SUSPENSE=1},
                //* ____RedirectModal_____: NULL=1
                //* }
        //! AFTER_CHECK_AUTH
            //! NO_REDIRECT
                //? WAIT_AUTH(LAZY) -> NO_WAIT(LAZY)
                    //* {
                    //* ____usePageStateSetUp____: 2,
                    //* ____ProtectedElement_____: 3,
                    //* ____LOADER_____: {LOADING=3, SUSPENSE=2},
                    //* ____RedirectModal_____: NULL=1
                    //* }
            //! REDIRECT
                //? WAIT_AUTH(LAZY) -> NO_WAIT(LAZY)
                    //* {
                    //* ____usePageStateSetUp____: 3,
                    //* ____ProtectedElement_____: 3,
                    //* ____LOADER_____: {LOADING=4, SUSPENSE=2},
                    //* ____RedirectModal_____: MODAL=1, NULL=2
                    //* }


//!NO_AUTH
    //? WAIT_AUTH(LAZY) -> NO_WAIT(LAZY) : (SETUP:1) +
    //? WAIT_AUTH(LAZY) -> WAIT_AUTH(LAZY) : (DIFFERENT_ROUTE), (SETUP:1) +
    //? WAIT_AUTH(LAZY) -> WAIT_AUTH(LAZY) : (SAME_ROUTE), (SETUP:1) +
    //? NO_WAIT(LAZY) -> WAIT_AUTH(LAZY) : (SETUP:1) +
    //? NO_WAIT(LAZY) -> NO_WAIT(LAZY) : (DIFFERENT_ROUTE), (SETUP:2) +
    //? NO_WAIT(LAZY) -> NO_WAIT(LAZY) : (SAME_ROUTE), (SETUP:1) +
