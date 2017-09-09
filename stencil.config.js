exports.config = {
  bundles: [
    { components: ['tq-tabs', 'tq-list', 'tq-search'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
