import {ComponentType, FC, lazy, Suspense} from 'react';
import {PathRouteProps, Route, Routes, Link} from 'react-router-dom';

const Main = lazy( () => new Promise(resolve => {
    //@ts-ignore
    setTimeout(() => resolve(import("pages/Main")), 1500)
}));
const About = lazy( () => new Promise(resolve => {
    //@ts-ignore
    setTimeout(() => resolve(import("pages/About")), 1500)
}));

export const routesConfig: Array<PathRouteProps & { Element: ComponentType; path: string }> = [
    {
        path: '/',
        Element: Main
    },
    {
        path: '/about',
        Element: About
    },
];


const AppRouter: FC = () => {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
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
