import { fireEvent, screen } from '@testing-library/react';
import { componentRender } from '@config/jest/ui/componentRender';
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
    });


    test('Render', () => {
        componentRender(<Sidebar />);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('test toggle', () => {
        componentRender(<Sidebar />);
        const toggleBtn = screen.getByTestId('sidebar-toggle');
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        fireEvent.click(toggleBtn);
        expect(screen.getByTestId('sidebar')).toHaveClass('collapsed');
    });
});
