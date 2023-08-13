import classNames from './classNames';


describe('classNames', () => {
    test('with only first param', () => {
        expect(classNames('someClass')).toBe('someClass');
    });

    test('with additional class', () => {
        const expected = 'someClass class1 class2';
        expect(classNames('someClass', [ 'class1', 'class2' ]))
            .toBe(expected);
    });

    test('with mods', () => {
        const expected = 'someClass class1 class2 hovered scrollable';
        expect(classNames(
            'someClass',
            [ 'class1', 'class2' ],
            { hovered: true, scrollable: true },
        )).toBe(expected);
    });

    test('with mods false', () => {
        const expected = 'someClass class1 class2 hovered';
        expect(classNames(
            'someClass',
            [ 'class1', 'class2' ],
            { hovered: true, scrollable: false },
        )).toBe(expected);
    });

    test('with mods undefined', () => {
        const expected = 'someClass class1 class2 hovered';
        expect(classNames(
            'someClass',
            [ 'class1', 'class2' ],
            { hovered: true, scrollable: undefined },
        )).toBe(expected);
    });
});
