//UPDATE SCENARIOS

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
