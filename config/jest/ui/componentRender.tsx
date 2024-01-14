import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { type ReactNode } from 'react';
import StoreProvider from 'app/providers/StoreProvider';
import { type IStateSchema } from 'config/store';
import { Routes } from 'shared/const';


export interface IComponentRenderOptions {
    route?: string;
    initialState?: DeepPartial<IStateSchema>;
}

export function componentRender(component: ReactNode, options: IComponentRenderOptions = {}) {
    const { route = Routes.MAIN, initialState } = options;

    return render(
        <MemoryRouter initialEntries={ [ route ] }>
            <StoreProvider
                initialState={ initialState }
                withStateSetup={ false }
            >
                { component }
            </StoreProvider>
        </MemoryRouter>,
    );
}
