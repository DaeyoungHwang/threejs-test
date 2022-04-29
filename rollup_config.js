import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { terser } from "rollup-plugin-terser"; // code minification (optional)
import * as path from "path";

export default {
	input: 'src/main.js',
	output: [
		{
			format: 'umd',
			name: 'MYAPP',
			file: 'build/bundle.js'
		}
	],
	plugins: [resolve(), serve({
		host: "localhost",
		port: 3004
	}), livereload(), terser()]
};
