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
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 2 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 0, types: []
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 2, MODAL: 1, types: [ 'FIRST_RENDER' ]
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
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 2 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'NOT_FIRST_RENDER' ]
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
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 1,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 0, MODAL: 0, types: []
            }
        },
        'WAIT_AUTH/REDIRECT': {
            ____usePageStateSetUp____: 2,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'NOT_FIRST_RENDER' ]
            }
        },
    }
};
//! NO_AUTH +$
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=2, MODAL=1
            //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1 | 0,
            //* ____RedirectModal_____: 0
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: (LOADING=2, SUSPENSE=1) | 0,
            //* ____RedirectModal_____: 0
            //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: (LOADING=3, SUSPENSE=1) | 0,
            //* ____RedirectModal_____: NULL=1, MODAL=1
            //* }

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
    FRL: JSON.parse(JSON.stringify(noAuth.FRL)),
    NFRL: JSON.parse(JSON.stringify(noAuth.NFRL)),
    NFRLL: JSON.parse(JSON.stringify(noAuth.NFRLL)),
};
//! AUTH +$
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=2, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: NULL=2, MODAL=1
            //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: SUSPENSE=1 | 0,
            //* ____RedirectModal_____: 0
            //* }
        //? WAIT_AUTH(LAZY) +
        //! NO_REDIRECT
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 1,
            //* ____LOADER_____: (LOADING=2, SUSPENSE=1) | 0,
            //* ____RedirectModal_____: 0
            //* }
        //? WAIT_AUTH(LAZY) +
        //! REDIRECT
            //* {
            //* ____usePageStateSetUp____: 2,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: (LOADING=3, SUSPENSE=1) | 0,
            //* ____RedirectModal_____: NULL=1, MODAL=1
            //* }

export const login = {
    config: {
        RFRL: {
            'NO_WAIT': { authorized: '/' },
            'WAIT_AUTH': { authorized: '/profile' }
        },
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
            }

        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 1, LOADING: 3 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
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
            }
        },
        'WAIT_AUTH': {
            ____usePageStateSetUp____: 1,
            ____ProtectedElement_____: 2,
            ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
            ____RedirectModal_____: {
                NULL: 1, MODAL: 1, types: [ 'ON_AUTH' ]
            }
        }
    },
    NR: {
        ____usePageStateSetUp____: 0,
        ____ProtectedElement_____: 0,
        ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
        ____RedirectModal_____: {
            NULL: 0, MODAL: 0, types: []
        }
    }
};
//! LOGIN +$
    //! REDIRECT +
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 1,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: SUSPENSE=1,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 1,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: LOADING=3, SUSPENSE=1,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 1,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: 0,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
        //? WAIT_AUTH(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 1,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: 0,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //! NO_REDIRECT +
        //* NOT_RENDERING

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
    RFRL: JSON.parse(JSON.stringify(login.RFRL)),
    RNFRL: JSON.parse(JSON.stringify(login.RNFRL)),
    NR: {
        ____usePageStateSetUp____: 0,
        ____ProtectedElement_____: 0,
        ____LOADER_____: { SUSPENSE: 0, LOADING: 0 },
        ____RedirectModal_____: {
            NULL: 0, MODAL: 0, types: []
        }
    }
};
//! LOGOUT +$
    //! REDIRECT +
    //? FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: SUSPENSE=1,
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: LOADING=3, SUSPENSE=1,
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: 0,
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
        //? WAIT_AUTH(LAZY) +
            //* {
            //* ____usePageStateSetUp____: 1,
            //* ____ProtectedElement_____: 2,
            //* ____LOADER_____: 0,
            //* ____RedirectModal_____: MODAL=1, NULL=1
            //* }
    //! NO_REDIRECT +
        //* NOT_RENDERING

//! AUTH_EXPIRED +$
    //! NAVIGATE TO -> ANY_NO_REDIRECT_PAGE
    //! (PAGE MUST BE REDIRECTED WHEN NAVIGATE TO NOT_PROTECTED_PAGE
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
