import { useEffect, useState } from 'react';
import AppButton from 'shared/ui/AppButton';

// Компонент для тестирования ErrorBoundary
const BugButton = () => {
    const [ error, setError ] = useState(false);

    const onThrow = () => setError(true);

    useEffect(() => {
        if (error) {
            throw new Error();
        }
    }, [ error ]);

    return (
        <AppButton
            onClick={ onThrow }
        >
            { 'throw error' }
        </AppButton>
    );
};

export default BugButton;
