exports.config =
  files:
    templates:
      joinTo:
        'js/templates.js': /.+\.jade$/
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor)/
