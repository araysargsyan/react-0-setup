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
        show: boolean;
        context: {
            redirectTo: string | null;
            from: string;
        };
    }>;
}>> = ({
    children,
    usePageStateSetup,
    asyncReducer,
    RedirectionModal
}) => {
    // const isAppReady = useSelector(({ app }: IStateSchema) => app.isAppReady);
    const {
        redirectTo, pathname, from
    } = usePageStateSetup(asyncReducer);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
            redirectTo, pathname, asyncReducer
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
                    show={ Boolean(redirectTo) }
                    context={{
                        redirectTo,
                        from
                    }}
                />
            ) : null }
            { children }
        </>
    );
};

export default StateSetupProvider;
