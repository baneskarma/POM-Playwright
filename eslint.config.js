import globals from 'globals';
import pluginJs from '@eslint/js';
// import compat, { rules } from 'eslint-plugin-compat';
import compatPlugin from 'eslint-plugin-compat';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import { parseForESLint } from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import { eslintCustomRules } from './tests-configuration/eslint-custom-rules/EslintCustomRules.js';

const { rules: compatRecommended } = compatPlugin.rules;
const eslintRecommended = pluginJs.configs.recommended.rules;
const prettierRecommended = prettierConfig.rules;
// const stylisticJsRules = stylisticJsPlugin.rules;

// RUN: npx  eslint ./tests-configuration/api-config/authentication.js ------ use --fix after eslint to fix the script.
// RUN: npx prettier --write . ------- to apply prettier to whole project.
// RUN: npx eslint --print-config eslint.config.js
export default [
	{
		// Node.js environment for API tests
		files: ['api-pages/**/*.js', 'tests/api-tests/**/*.js', 'tests-configuration/api-config/*.js', 'tests-configuration/GlobalSetup.js', 'tests-configuration/GlobalTearDown.js'],

		languageOptions: { globals: { ...globals.node } },

		rules: { ...eslintRecommended },
	},

	{
		// Browser environment for UI automation tests
		files: ['tests/ui-tests/**/*.js', 'pages/**/*.js', 'tests-configuration/TestsConfig.js'],

		languageOptions: { globals: globals.browser },

		plugins: { compat: compatPlugin },

		// settings: {
		//   polyfills: [
		//     // No polyfills for UI automation tests for now
		//   ]
		// },

		rules: {
			...eslintRecommended,
			...compatRecommended,
			'compat/compat': ['error'],
			// ['error', {
			//   // Add any specific options for the compat rule here if necessary
			// }],
		},
	},

	// Shared configuration for both environments
	{
		files: ['**/*.js', 'tests-configuration/TestsConfig.mjs'],

		languageOptions: {
			ecmaVersion: 12,
			sourceType: 'module',
			globals: { ...globals.node },
			parser: { parseForESLint },
		},

		settings: {
			polyfills: ['Promise', 'Promise.all'],
		},

		plugins: {
			prettier: eslintPluginPrettier,
			stylistic: stylisticJsPlugin,
			'@typescript-eslint': typescriptEslint,
			'check-file': checkFile,
			'eslint-custom-rules': eslintCustomRules,
		},

		ignores: [
			// prettier-ignore
			'node_modules/*.js',
			'test-results/*.js',
			'allure-results/*.js',
			'allure-report/*.js',
			'playwright-report/*.js',
			'.vscode/*',
			'environments/.env*',
			'**/*index.js',
			'**/*config.js',
			// '**/*.json',
		],

		rules: {
			...eslintRecommended,
			...prettierRecommended,
			// 'prettier/prettier': [
			// 	'error',
			// 	{
			// 		singleQuote: true,
			// 		parser: 'flow',
			// 		semi: true,
			// 		trailingComma: 'es5',
			// 		// use 'printWidth' to NOT break statements into multiple lines or use 'max-len' to break statements.
			// 		// "max-len": Infinity,
			// 		printWidth: Infinity,
			// 		'object-curly-newline': [{ multiline: true, consistent: false }],
			// 		'array-bracket-spacing': true,
			// 		'array-bracket-newline': true,
			// 		'newline-per-chained-call': false,
			// 		// 'function-call-argument-newline': false,
			// 		// 'space-before-blocks': true,
			// 	},
			// ],
			'stylistic/space-in-parens': ['warn', 'always', { exceptions: ['{}', 'empty'] }],
			'stylistic/array-bracket-spacing': ['warn', 'always', { objectsInArrays: false }],
			'object-curly-newline': ['error', { multiline: true, consistent: true }],
			'no-unused-vars': 'warn',
			'comma-spacing': ['warn', { before: false, after: true }],
			'no-restricted-syntax': [
				'error',
				{
					selector: "CallExpression[callee.property.name='only']",
					message: "We don't want to leave test.only on our tests",
				},
			],
			// Enforce PascalCase for filenames
			'check-file/filename-naming-convention': [
				'error',
				{
					'**/*.js': 'PASCAL_CASE',
					'**/*.json': 'FLAT_CASE',
				},
				{
					ignoreMiddleExtensions: true,
				},
			],
			// 'filenames/match-regex': 'off',
			// Enforce KEBAB_CASE for directories (lowercase with hyphens for multiple words)
			'check-file/folder-naming-convention': [
				'error',
				{
					'**/*': 'KEBAB_CASE',
				},
			],
			// Enforce naming conventions

			// Custom rule for environment variables
			'eslint-custom-rules/env-vars-uppercase': 'error',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: ['function', 'method', 'variable', 'parameter'],
					format: ['camelCase'],
					// leadingUnderscore: 'allow',
					// trailingUnderscore: 'allow',
				},
				{
					selector: 'class',
					format: ['PascalCase'],
				},

				// {
				// 	selector: 'property', // for object properties
				// 	format: ['PascalCase'],
				// },
			],
		},
	},
];
