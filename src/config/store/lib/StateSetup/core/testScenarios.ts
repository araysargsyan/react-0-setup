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
    //! REDIRECT
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
    //! NO_REDIRECT
        //* NOT_RENDERING

//! LOGOUT +$
    //! REDIRECT
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
    //! NO_REDIRECT
        //* NOT_RENDERING

//! AUTH_EXPIRED +$
    //! REDIRECT(COUNT 2)
    //? FIRST_RENDER +
    //? NO_WAIT(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 2,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: (LOADING=2, SUSPENSE=2, render=2) | (SUSPENSE=1, render=1)
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //? WAIT_AUTH(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 2,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: (LOADING=4, SUSPENSE=2, render=2) | (LOADING=2, SUSPENSE=1, render=1)
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //? NOT_FIRST_RENDER +
        //? NO_WAIT(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 1,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: (LOADING=2, SUSPENSE=1) | 0,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //? WAIT_AUTH(LAZY) +
        //* {
        //* ____usePageStateSetUp____: 2,
        //* ____ProtectedElement_____: 2,
        //* ____LOADER_____: (LOADING=2, SUSPENSE=1) | 0,
        //* ____RedirectModal_____: MODAL=1, NULL=1
        //* }
    //! NO_REDIRECT
        //* NOT_RENDERING
