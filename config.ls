exports.config =
  files:
    templates:
      joinTo:
        'js/templates.js': /.+\.jade$/
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: <[
          vendor/angular/angular.min.js
          vendor/jquery/jquery.min.js
          vendor/js2coffee.org/underscore.min.js
        ]>
    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor)/
