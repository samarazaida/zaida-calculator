import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

import project from './package.json';

function buildBabelConfig() {
  return {
    babelrc: false,
    plugins: [
      'external-helpers',
      'transform-object-rest-spread'
    ],
    presets: [
      [
        'env',
        {
          exclude: [
            'transform-es2015-typeof-symbol',
          ],
          modules: false,
        },
      ],
    ],
  };
}

function buildConfigBuilder({
  dist = 'dist',
  globalName,
  input,
  projectName,
}) {
  return ({
    bundleSize = false,
    extension,
    format,
    includeExtension = true,
    minified = false,
    sourceMap = false,
    transpiled = true,
  }) => {
    function buildFileName() {
      return `${projectName}${includeExtension ? `.${extension || format}` : ''}${
        minified ? '.min' : ''
      }.js`;
    }

    function buildPlugins() {
      const plugins = [];
      if (transpiled) plugins.push(babel(buildBabelConfig()));
      if (minified) plugins.push(uglify());
      if (resolve) plugins.push(resolve());
      if (commonjs) plugins.push(commonjs());
      if (bundleSize) plugins.push(filesize());
      return plugins;
    }

    return {
      input,
      output: {
        dir: dist,
        file: buildFileName(),
        format,
        name: globalName,
        sourcemap: sourceMap,
      },
      plugins: buildPlugins(),
    };
  };
}

const buildConfig = buildConfigBuilder({
  globalName: 'zaidaCalculator',
  input: './src/main.js',
  projectName: project.name,
});

const configs = [
  buildConfig({ format: 'amd' }),
  buildConfig({ format: 'cjs' }),
  buildConfig({ format: 'umd' }),
  buildConfig({
    bundleSize: true,
    commonjs: true,
    format: 'umd',
    includeExtension: false,
    minified: true,
    resolve: true,
    sourceMap: true,
  }),
  buildConfig({
    extension: 'browser',
    format: 'iife',
  }),
  buildConfig({
    bundleSize: true,
    commonjs: true,
    extension: 'browser',
    format: 'iife',
    resolve: true,
    minified: true,
    sourceMap: true,
  }),
  buildConfig({ format: 'esm' }),
  buildConfig({ format: 'system' }),
];

export default configs;