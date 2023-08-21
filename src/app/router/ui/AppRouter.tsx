import { type FC, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routesConfig } from 'config/router';
import PageLoader from 'components/PageLoader';


const AppRouter: FC = () => {
    return (
        <Suspense fallback={ <PageLoader /> }>
            <div className="page-wrapper">
                <Routes>
                    { routesConfig.map(({ path, Element }) => (
                        <Route
                            path={ path }
                            element={ <Element /> }
                            key={ path }
                        />
                    )) }
                </Routes>
            </div>
        </Suspense>
    );
};

export default AppRouter;
