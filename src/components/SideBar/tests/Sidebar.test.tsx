import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '@config/jest/ui/renderWithRouter';

import Sidebar from '../Sidebar';


describe('Sidebar', () => {
    test('Render', () => {
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
