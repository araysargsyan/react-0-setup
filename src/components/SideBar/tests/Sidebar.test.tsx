import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '@config/jest/ui/renderWithRouter';
import React from 'react';
import * as themeModules from 'app/providers/theme';
import { ETheme } from 'app/providers/theme';

import Sidebar from '../ui/Sidebar';


describe('Sidebar', () => {
    beforeAll(() => {
        jest.spyOn(themeModules, 'useTheme').mockImplementation(jest.fn().mockReturnValue({
            theme: ETheme.LIGHT,
            toggleTheme: jest.fn(),
        }));
        // jest.mock('../../../config/router', () => ({ ERoutes: 5 }));
    });


    test('Render', () => {
        // jest.mock('../../../config/router', () => ({ ERoutes: 5 }));

        renderWithRouter(<Sidebar />);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('test toggle', () => {
        renderWithRouter(<Sidebar />);
        const toggleBtn = screen.getByTestId('sidebar-toggle');
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        fireEvent.click(toggleBtn);
        expect(screen.getByTestId('sidebar')).toHaveClass('collapsed');
    });
});
