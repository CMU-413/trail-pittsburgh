import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ['dist/**/*', 'node_modules/**/*'],
    },
    {
        files: ['**/*.{js,ts}'],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'], // Only apply TypeScript-specific parser options to TypeScript files
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021
            },
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
                createDefaultProgram: true,
            }
        }
    },
    importPlugin.flatConfigs.recommended,
    {
        rules: {
            // TypeScript-specific rules
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error',
                { 'caughtErrors': 'none', 'argsIgnorePattern': '^_', }
            ],
            // General JavaScript rules

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
            'max-len': ['error', { 'code': 100, 'ignoreStrings': true, 'ignoreTemplateLiterals': true }],
            'function-paren-newline': ['error', 'consistent'],
            'object-curly-newline': ['error', { 'ImportDeclaration': { 'minProperties': 3, 'consistent': true } }],
            'arrow-parens': ['error', 'always'],
            'eol-last': ['error', 'always'],
            'no-var': 'error',

            // ES Module rules
            'import/no-unresolved': 'off',
            'import/no-default-export': 'error',
            'import/order': [
                'error',
                {
                    'newlines-between': 'always',
                    'alphabetize': { order: 'asc' }
                }
            ],
            'quotes': [
                'error',
                'single',
                { 'avoidEscape': true, 'allowTemplateLiterals': true } // Allow backticks
            ]
        }
    },
    {
        // Override for eslint.config.js
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off', // Disable the rule for this file
        },
    },
];
