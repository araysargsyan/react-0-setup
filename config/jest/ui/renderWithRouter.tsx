import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { type ReactNode } from 'react';
import { ERoutes } from 'config/router';


export interface componentRenderOptions {
    route?: string;
}

export function renderWithRouter(component: ReactNode, options: componentRenderOptions = {}) {
    const { route = ERoutes.MAIN, } = options;

    return render(
        <MemoryRouter initialEntries={ [ route ] }>
            { component }
        </MemoryRouter>,
    );
}
