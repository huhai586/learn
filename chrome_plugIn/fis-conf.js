fis.config.set('settings.optimizer.uglify-js', option);
fis.match('*.js', {
  useHash: false,
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  useHash: false
});

fis.match('*.png', {
  useHash: false
});