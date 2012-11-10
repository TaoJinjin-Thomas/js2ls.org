(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"angular-ace": function(exports, require, module) {
  angular.module('ace', []).directive('ace', function(){
    var loadAceEditor, ACE_EDITOR_CLASS;
    loadAceEditor = function(element, mode, isReadOnly){
      var x$;
      return (x$ = window.ace.edit($(element).find("." + ACE_EDITOR_CLASS)[0]), x$.session.setMode("ace/mode/" + mode), x$.renderer.setShowPrintMargin(false), x$.setReadOnly(isReadOnly), x$);
    };
    ACE_EDITOR_CLASS = 'ace-editor';
    return {
      restrict: 'A',
      require: '?ngModel',
      transclude: true,
      template: "<div class='transcluded' ng-transclude></div><div class='" + ACE_EDITOR_CLASS + "'></div>",
      link: function(scope, element, arg$, ngModel){
        var mode, editor_id, rightEditorChangeHandler, leftEditorChangeHandler, read, textarea, editor, err;
        mode = arg$.ace, editor_id = arg$.id;
        rightEditorChangeHandler = function(){
          return $('#left_arrow').fadeIn();
        };
        leftEditorChangeHandler = function(){
          return read();
        };
        read = function(){
          var cs, e, ls;
          if (ngModel) {
            ngModel.$setViewValue(editor.getValue());
            textarea.val(editor.getValue());
          }
          cs = '';
          $(err).html('').hide();
          switch (editor_id) {
          case 'cs2lslefteditor':
            cs = editor.getValue();
            break;
          case 'js2lslefteditor':
            try {
              cs = Js2coffee.build(editor.getValue());
            } catch (e$) {
              e = e$;
              $(err).html(e + "").show();
            }
            break;
          case 'js2lsrighteditor':
            try {
              cs = Js2coffee.build(scope.js2lslefteditor.getValue());
            } catch (e$) {
              e = e$;
              $(err).html(e + "").show();
            }
            break;
          case 'cs2lsrighteditor':
            cs = scope.cs2lslefteditor.getValue();
          }
          if (/^\s*(#\s*.*)?\s*$/.exec(cs)) {
            return;
          }
          ls = '';
          try {
            ls = coffee2ls.compile(coffee2ls.parse(cs));
          } catch (e$) {
            e = e$;
            $(err).html('').append($('<pre/>').css('text-align', 'left').text(e)).show();
            return;
          }
          switch (editor_id) {
          case 'js2lslefteditor':
          case 'js2lsrighteditor':
            if (!(editor_id === 'js2lslefteditor' && scope.righteditor_changed)) {
              try {
                scope.js2lsrighteditor.getSession().setValue(ls);
              } catch (e$) {}
              $('#left_arrow').hide();
            }
            return scope.righteditor_changed === false;
          case 'cs2lslefteditor':
          case 'cs2lsrighteditor':
            try {
              return scope.cs2lsrighteditor.getSession().setValue(ls);
            } catch (e$) {}
          }
        };
        textarea = $(element).find('textarea').hide();
        editor = (function(){
          switch (editor_id) {
          case 'js2lslefteditor':
          case 'js2lsrighteditor':
          case 'cs2lslefteditor':
            return loadAceEditor(element, mode, false);
          case 'cs2lsrighteditor':
            return loadAceEditor(element, mode, true);
          }
        }());
        err = (function(){
          switch (editor_id) {
          case 'js2lslefteditor':
          case 'js2lsrighteditor':
            return '#js2lserror';
          case 'cs2lslefteditor':
          case 'cs2lsrighteditor':
            return '#cs2lserror';
          }
        }());
        scope.ace = scope[editor_id] = editor;
        if (!ngModel) {
          read();
          if (editor_id === 'js2lsrighteditor') {
            editor.getSession().on('change', rightEditorChangeHandler);
          }
          return;
        }
        ngModel.$render = function(){
          var value;
          value = ngModel.$viewValue || '';
          editor.getSession().setValue(value);
          return textarea.val(value);
        };
        editor.getSession().on('change', leftEditorChangeHandler);
        editor.getSession().setValue(textarea.val());
        return read();
      }
    };
  });
}});

window.require.define({"controllers": function(exports, require, module) {
  window.TabCtrl = function($scope){
    $scope.currentTab = 'JavaScript';
    $('#js2ls').show();
    $('#cs2ls').hide();
    $('#left_arrow').hide();
    $scope.tabs = [
      {
        name: 'JavaScript',
        mode: 'javascript',
        selected: true
      }, {
        name: 'CoffeeScript',
        mode: 'coffee',
        selected: false
      }
    ];
    $scope.toggleTab = function(tabName){
      if ($scope.currentTab === tabName) {
        return;
      }
      $scope.currentTab = tabName;
      angular.forEach($scope.tabs, function(tab){
        return tab.selected = $scope.currentTab === tab.name;
      });
      switch ($scope.currentTab) {
      case 'JavaScript':
        $('#js2ls').show();
        return $('#cs2ls').hide();
      case 'CoffeeScript':
        $('#cs2ls').show();
        $('#js2ls').hide();
        return $('#left_arrow').hide();
      }
    };
    return $scope.lsChangeHandler = function(){
      var ls, js, e, x$;
      $scope.righteditor_changed = true;
      ls = $scope.js2lsrighteditor.getValue();
      js = '';
      try {
        js = coffee2ls.ls2js(ls);
      } catch (e$) {
        e = e$;
        x$ = $('#js2lserror');
        x$.html('');
        x$.append($('<pre/>').css('text-align', 'left').text(e));
        x$.show();
        return;
      }
      $scope.js2lslefteditor.getSession().setValue(js);
      $scope.righteditor_changed = false;
      $('#left_arrow').fadeOut('fast');
      return $scope.js2lsrighteditor.focus();
    };
  };
  angular.module('myapp', ['ace']);
}});

