import { render, screen } from '@testing-library/react';

import AppButton from '../AppButton';


describe('AppButton', () => {
    test('toBeInTheDocument', () => {
        render(<AppButton>Test</AppButton>);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
    test('asd', () => {
        render(<AppButton>Test</AppButton>);
        expect(screen.getByText('Test')).toHaveClass('app-button');
    });
});
