import {
    type Context, createContext, type FC, type PropsWithChildren, useCallback, useContext, useMemo, useRef
} from 'react';
import { type NavigateFunction, useNavigate } from 'react-router-dom';


const EnhancedStoreProviderContext = createContext(null) as never as Context<{
    getNavigate: () => NavigateFunction;
}>;
const EnhancedStoreProvider:FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const cashedNavigate = useRef(navigate);
    cashedNavigate.current = navigate;
    const getNavigate = useCallback(() => cashedNavigate.current, []);
    const value = useMemo(() => ({ getNavigate }), [ getNavigate ]);

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

export { useEnhancedStoreProvider };
export default withEnhancedStoreProvider;
