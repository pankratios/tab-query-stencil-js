exports.config = {
  bundles: [
    { components: ['tq-tabs', 'tq-search-box'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
