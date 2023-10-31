import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './index.js',  // Path to your main JavaScript file
  output: {
    file: 'dist/bundle.js',  // Path to the output file
    format: 'esm',
    name: 'WheelBundle',  // Name for the global variable holding the exports (if any)
  },
  plugins: [
    resolve(),
    terser(),
  ],
};