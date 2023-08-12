import {FC, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {routesConfig} from "app/config/router-config";

const AppRouter: FC = () => {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <div className="page-wrapper">
                <Routes>
                    {routesConfig.map(({path, Element}) => (
                        <Route
                            path={path}
                            element={<Element/>}
                            key={path}
                        />
                    ))}
                </Routes>
            </div>
        </Suspense>
    );
};

export default AppRouter;
