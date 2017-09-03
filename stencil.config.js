exports.config = {
  bundles: [
    { components: ['tq-tabs', 'search-box'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
