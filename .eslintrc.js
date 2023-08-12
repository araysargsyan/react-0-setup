// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dependencies } = require('./package.json');


module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'import'
    ],
    rules: {
        'semi': 'error',
        'quotes': [ 'error', 'single', { 'avoidEscape': true } ],
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'space-in-parens': [ 'error', 'never' ],
        'jsx-quotes': [ 'error', 'prefer-double' ],
        'indent': [ 'error', 4, {
            'ignoreComments': true,
            'offsetTernaryExpressions': true,
            'flatTernaryExpressions': false,
            'ImportDeclaration': 'first',
            'ObjectExpression': 1,
            'ArrayExpression': 1,
            'CallExpression': { 'arguments': 1 },
            'MemberExpression': 1,
            'outerIIFEBody': 'off',
            'VariableDeclarator': 'first',
            'SwitchCase': 1
            //"FunctionDeclaration": {"parameters": "first"}
        } ],
        'space-before-blocks': [ 'error', {
            'functions': 'always',
            'keywords': 'always',
            'classes': 'always'
        } ],
        'keyword-spacing': [ 'error', { 'before': true, 'after': true } ],
        'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
        'func-call-spacing': [ 'error', 'never' ],
        'space-before-function-paren': [ 'error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        } ],
        'brace-style': 'error',
        // 'no-unused-vars': [ 'warn', {
        //     vars: 'all',
        //     args: 'after-used',
        //     ignoreRestSiblings: false,
        //     argsIgnorePattern: '^_$',
        //     //varsIgnorePattern: '^_$'
        // } ],
        //react
        'react/jsx-curly-spacing': [
            'error',
            {
                'when': 'always',
                'children': true,
                'spacing': {
                    'objectLiterals': 'never'
                }
            }
        ],
        'react/jsx-curly-newline': [ 'error', { 'multiline': 'consistent', 'singleline': 'forbid' } ],
        'react/jsx-equals-spacing': [ 'error', 'never' ],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off',
        'react/jsx-no-comment-textnodes': 'off',
        'react/no-children-prop': 'off',
        'react/jsx-max-props-per-line': 'error',
        'react/jsx-indent': [ 'error', 4, { 'checkAttributes': true, 'indentLogicalExpressions': true } ],
        'react/jsx-indent-props': [ 'error', 4 ],
        'react/jsx-key': 'error',
        'react/jsx-first-prop-new-line': 'error',
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-wrap-multilines': [
            'error',
            {
                'declaration': 'parens-new-line',
                'assignment': 'parens-new-line',
                'return': 'parens-new-line',
                'arrow': 'parens-new-line',
                'condition': 'parens-new-line',
                'logical': 'parens-new-line',
                'prop': 'parens-new-line'
            }
        ],
        'react/jsx-child-element-spacing': 'error',
        'react/jsx-closing-bracket-location': [ 'error', { 'selfClosing': 'tag-aligned', 'nonEmpty': 'tag-aligned' } ],
        'react/jsx-props-no-multi-spaces': 'error',
        'react/jsx-tag-spacing': [
            'error',
            {
                'closingSlash': 'never',
                'beforeSelfClosing': 'always',
                'afterOpening': 'never',
                'beforeClosing': 'never'
            }
        ],
        //@typescript-eslint
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars':  [ 'warn', {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_$',
            //varsIgnorePattern: '^_$'
        } ],
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/member-delimiter-style': 'error',
        //import
        'import/order': [
            'error',
            {
                groups: [
                    [ 'builtin', 'external' ],
                    'internal',
                    [ 'parent', 'sibling', 'index' ]
                ],
                'newlines-between': 'always',
            },
        ],
        'import/consistent-type-specifier-style':  [ 'error', 'prefer-inline' ],
        'import/no-duplicates': [ 'error', { 'prefer-inline': true } ],
        'import/newline-after-import': [ 'error', { 'count': 2, 'considerComments': false } ]
    },
    globals: {
        __IS_DEV__: true,
    },
    settings: {
        'react': {
            version: dependencies.react,
        }
    }
};
