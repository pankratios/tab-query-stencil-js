exports.config = {
  bundles: [
    { components: ['tq-list', 'tq-search'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
