import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { configs } from 'eslint-plugin-import';

export default tseslint.config(
    { ignores: ['dist/**/*'] },
    {
        plugins: {
            'import': configs.recommended,
        },
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'prefer-const': 'error',
            'no-console': 'warn',
            'eqeqeq': ['error', 'always'],
            'curly': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'indent': ['error', 4],
            'semi': ['error', 'always'],
            'no-duplicate-imports': 'error',
            'no-useless-return': 'error',
            'prefer-template': 'error',
            'no-return-await': 'error',
            'no-unsafe-optional-chaining': 'error',
            'max-len': ['error', { 'code': 80, 'ignoreStrings': true, 'ignoreTemplateLiterals': true }],
            'function-paren-newline': ['error', 'consistent'],
            'object-curly-newline': ['error', { 'ImportDeclaration': { 'minProperties': 3, 'consistent': true } }],
            'arrow-parens': ['error', 'always'],
            'eol-last': ['error', 'always'],
            'no-var': 'error',
            'quotes': [
                'error',
                'single',
                { 'avoidEscape': true, 'allowTemplateLiterals': true } // Allow backticks
            ]
        },
    },
);
