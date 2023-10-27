import {
    type FC,
    type PropsWithChildren,
    useEffect, useState
} from 'react';
import { Navigate } from 'react-router-dom';

import { type TAsyncReducer } from './types';


const StateSetupProvider: FC<PropsWithChildren<{
    usePageStateSetup: any;
    asyncReducer?: TAsyncReducer;
    RedirectionModal?: FC<{
        mustShow: any;
        useContext: any;
    }>;
}>> = ({
    children,
    usePageStateSetup,
    asyncReducer,
    RedirectionModal
}) => {
    // const isAppReady = useSelector(({ app }: IStateSchema) => app.isAppReady);
    const {
        pathname, mustShow, useContext
    } = usePageStateSetup(asyncReducer);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
            useContext, pathname, asyncReducer, mustShow
        });
    });
    // if (!isAppReady) {
    //     return null;
    //     // return <h1>{ 'APP IS NOT READY' }</h1>;
    // }
    //
    // if (redirectTo) {
    //     return (
    //         <Navigate
    //             to={ redirectTo }
    //             state={{ from: pathname }}
    //         />
    //     );
    // }

    //! if not null
    return (
        <>
            { RedirectionModal ? (
                <RedirectionModal
                    mustShow={ mustShow }
                    useContext={ useContext }
                />
            ) : null }
            { children }
        </>
    );
};

export default StateSetupProvider;
