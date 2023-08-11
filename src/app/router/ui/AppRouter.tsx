import {FC, Suspense} from 'react';
import {Route, Routes } from 'react-router-dom';
import {routesConfig} from "../config";

const AppRouter: FC = () => {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Routes>
                {routesConfig.map(({path, Element}) => (
                    <Route
                        path={path}
                        element={<Element/>}
                        key={path}
                    />
                ))}
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
