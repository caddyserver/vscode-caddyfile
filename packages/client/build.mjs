import { exit } from 'node:process';
import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import { build } from 'esbuild';

const isProduction = process.env.NODE_ENV !== 'development';

build({
	sourcemap: isProduction,
	legalComments: 'none',
	format: 'cjs',
	target: 'esnext',
	minify: isProduction,
	charset: 'utf8',
	logLevel: 'info',
	watch: !isProduction,

	bundle: true,
	external: ['vscode'],
	outfile: 'dist/index.cjs',
	entryPoints: ['src/index.ts'],
	platform: 'node',
	plugins: [pnpPlugin()],
}).catch(() => exit(1));
