exports.config = {
  bundles: [
    { components: ['tq-tabs', 'tq-list', 'tq-search'] }
  ],
  copy: [
    { src: './images/*.png', dest: 'images' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
