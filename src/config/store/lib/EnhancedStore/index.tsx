import {
    type Context, createContext, type FC, type PropsWithChildren, useCallback, useContext, useMemo, useRef
} from 'react';
import {
    type Location, type NavigateFunction, useLocation, useNavigate
} from 'react-router-dom';


interface IEnhancedStoreProviderValue {
    getNavigate: () => NavigateFunction;
    getLocation: () => Location;
}
const EnhancedStoreProviderContext = createContext(null) as never as Context<IEnhancedStoreProviderValue>;
const EnhancedStoreProvider:FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const cashedNavigate = useRef(navigate);
    const cashedLocation = useRef(location);
    cashedNavigate.current = navigate;
    cashedLocation.current = location;
    const getNavigate = useCallback(() => cashedNavigate.current, []);
    const getLocation = useCallback(() => cashedLocation.current, []);
    const value = useMemo(() => ({ getNavigate, getLocation }), [ getNavigate, getLocation ]);

    return (
        <EnhancedStoreProviderContext.Provider value={ value }>
            { children }
        </EnhancedStoreProviderContext.Provider>
    );
};

function withEnhancedStoreProvider<T extends Record<string, any>>(StoreProvider: FC<T>) {
    // eslint-disable-next-line react/display-name
    return (props: T) => (
        <EnhancedStoreProvider>
            <StoreProvider { ...props } />
        </EnhancedStoreProvider>
    );
};

const useEnhancedStoreProvider = () => useContext(EnhancedStoreProviderContext);

export { useEnhancedStoreProvider, type IEnhancedStoreProviderValue };
export default withEnhancedStoreProvider;
