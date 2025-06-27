import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react' // Required if you're testing React components

export default defineConfig({
	plugins: [react()], // Add this line if you're testing React components
	test: {
		globals: true,
		environment: 'jsdom', // Use 'jsdom' for React components, 'node' for Node.js/backend tests
		setupFiles: './src/tests/setup.ts', // Optional: if you have a setup file
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/tests/**/*',
				'src/**/index.ts',
				'src/**/*.d.ts',
				'src/**/types.ts',
				'src/**/constants.ts',
				'src/app/**/*', // Excluding app directory (routes, layouts, etc.)
				'src/components/ui/**/*', // Assuming UI components might not need extensive unit tests or are tested via E2E
				'src/styles/**/*',
				'src/middleware.ts',
				'src/i18n-config.ts',
				'src/navigation.ts',
				'src/lib/pocketbase.ts', // Excluding pocketbase client instantiation
			],
		},
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
