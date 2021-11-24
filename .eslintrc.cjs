module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	],
	plugins: ['svelte3', '@typescript-eslint'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		'svelte3/ignore-styles': () => true
	},
	rules: {
		strict: ['error', 'never'],
		eqeqeq: ['error', 'always'],
		semi: ['error', 'never'],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		quotes: ['error', 'single', { avoidEscape: true }],
		'jsx-quotes': ['error', 'prefer-double'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/ban-ts-comment': 'off'
	},
	globals: {
		$$restProps: 'readonly'
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019,
		project: ['tsconfig.json', 'tsconfig.server.json', 'tsconfig.config.json']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
}
