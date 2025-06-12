import reactHooksPlugin from 'eslint-plugin-react-hooks'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import noOnlyTestsPlugin from 'eslint-plugin-no-only-tests'
import queryPlugin from '@tanstack/eslint-plugin-query'
import perfectionist from 'eslint-plugin-perfectionist'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'
import promisePlugin from 'eslint-plugin-promise'
import tsParser from '@typescript-eslint/parser'
import * as espree from 'espree'

// Configuration commune des règles
const baseRules = {
	'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug'] }],
	'no-only-tests/no-only-tests': 'error',
	'react-hooks/exhaustive-deps': 'off',
	'@next/next/no-img-element': 'off',
	'prettier/prettier': 'error',
	...nextPlugin.configs.recommended.rules,
	...nextPlugin.configs['core-web-vitals'].rules,
	'jsx-a11y/anchor-has-content': 'off',
	'promise/always-return': 'off',
	'jsx-a11y/alt-text': 'off',
}

// Configuration commune des règles perfectionist
const perfectionistRules = {
	'perfectionist/sort-imports': [
		'error',
		{
			groups: [
				'type',
				'react',
				'nanostores',
				['builtin', 'external'],
				'internal-type',
				'internal',
				['parent-type', 'sibling-type', 'index-type'],
				['parent', 'sibling', 'index'],
				'side-effect',
				'style',
				'object',
				'unknown',
			],
			customGroups: {
				value: {
					nanostores: '@nanostores/.*',
					react: ['react', 'react-*'],
				},
				type: {
					react: 'react',
				},
			},
			internalPattern: ['@/app/.*', '@/components/.*', '@/lib/.*', '@/models/.*', '@/services/.*', '@/constants/.*'],
			newlinesBetween: 'always',
			type: 'line-length',
			order: 'desc',
		},
	],
	'perfectionist/sort-objects': [
		'warn',
		{
			type: 'natural',
			order: 'desc',
		},
	],
	'perfectionist/sort-enums': [
		'error',
		{
			type: 'natural',
			order: 'desc',
		},
	],
}

// Plugins communs
const basePlugins = {
	'no-only-tests': noOnlyTestsPlugin,
	'react-hooks': reactHooksPlugin,
	'jsx-a11y': jsxA11yPlugin,
	'@next/next': nextPlugin,
}

// Options communes du parser
const baseParserOptions = {
	ecmaFeatures: { jsx: true },
	ecmaVersion: 'latest',
	sourceType: 'module',
}

export default [
	perfectionist.configs['recommended-natural'],
	eslintPluginPrettierRecommended,
	...queryPlugin.configs['flat/recommended'],
	promisePlugin.configs['flat/recommended'],

	// Configuration pour JavaScript
	{
		languageOptions: {
			parserOptions: baseParserOptions,
			parser: espree,
		},
		rules: {
			...baseRules,
			...perfectionistRules,
		},
		files: ['**/*.{js,jsx,mjs,cjs}'],
		plugins: basePlugins,
	},

	// Configuration pour TypeScript
	{
		rules: {
			...baseRules,
			...perfectionistRules,
			// Règles TypeScript spécifiques
			...tsPlugin.configs.recommended.rules,
			...tsPlugin.configs['recommended-type-checked'].rules,
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/strict-boolean-expressions': 'warn',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'warn',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
		languageOptions: {
			parserOptions: {
				...baseParserOptions,
				project: './tsconfig.json',
			},
			parser: tsParser,
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			...basePlugins,
		},
		files: ['**/*.{ts,tsx}'],
	},
]
