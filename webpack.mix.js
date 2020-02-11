const mix = require('laravel-mix')

mix.browserSync('pixabox.test')
  .js('resources/js/app.js', 'public/js')
  .version()
