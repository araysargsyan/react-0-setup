import { fireEvent, screen } from '@testing-library/react';
import renderWithTranslation from '@config/jest/ui/renderWithTranslation';

import Sidebar from '../Sidebar';


describe('Sidebar', () => {
    test('Render', () => {
        renderWithTranslation(<Sidebar />);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('test toggle', () => {
        renderWithTranslation(<Sidebar />);
        const toggleBtn = screen.getByTestId('sidebar-toggle');
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        fireEvent.click(toggleBtn);
        expect(screen.getByTestId('sidebar')).toHaveClass('collapsed');
    });
});
