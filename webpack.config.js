// @ts-check

const path = require('path');

/** @type {import("webpack").Configuration} */
const config = {
	target: 'node',
	devtool: 'source-map',

	entry: {
		main: './src/main.ts',
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		devtoolModuleFilenameTemplate: '../[resource-path]',
		sourceMapFilename: '[name].js.map',
	},

	externals: {
		// the vscode-module is created on-the-fly and must be excluded.
		vscode: 'commonjs vscode',
	},

	resolve: {
		extensions: ['.ts', '.js'],
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},

	optimization: {
		// when this is true, the debugger breaks...
		minimize: false,
	},
};

module.exports = config;
