import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  bundles: [
    { components: ['tq-tabs', 'tq-list', 'tq-search'] }
  ],
  copy: [
    { src: './images/*.png', dest: 'images' }
  ],
  plugins: [
    sass()
  ]
};

// exports.devServer = {
//   root: 'www',
//   watchGlob: '**/**'
// };
