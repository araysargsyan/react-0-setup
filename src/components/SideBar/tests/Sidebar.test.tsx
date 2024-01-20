import { fireEvent, screen } from '@testing-library/react';
import { componentRender } from '@config/jest/ui/componentRender';

import Sidebar from '../ui/Sidebar';


describe('Sidebar', () => {
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
