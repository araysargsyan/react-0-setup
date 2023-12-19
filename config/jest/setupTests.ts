import '@testing-library/jest-dom';

//! use render with this or renderWithTranslation
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: never) => key, }), }));

