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
      var editor;
      editor = window.ace.edit($(element).find('.' + ACE_EDITOR_CLASS)[0]);
      editor.session.setMode("ace/mode/" + mode);
      editor.renderer.setShowPrintMargin(false);
      editor.setReadOnly(isReadOnly);
      return editor;
    };
    ACE_EDITOR_CLASS = 'ace-editor';
    return {
      restrict: 'A',
      require: '?ngModel',
      transclude: true,
      template: '<div class="transcluded" ng-transclude></div><div class="' + ACE_EDITOR_CLASS + '"></div>',
      link: function(scope, element, attrs, ngModel){
        var rightEditorChangeHandler, leftEditorChangeHandler, read, textarea, mode, editor, editor_id, err;
        rightEditorChangeHandler = function(){
          return $('#left_arrow').css('display', 'block');
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
          $(err).html('');
          $(err).hide();
          switch (editor_id) {
          case 'cs2lslefteditor':
            cs = editor.getValue();
            break;
          case 'js2lslefteditor':
            try {
              cs = Js2coffee.build(editor.getValue());
            } catch (e$) {
              e = e$;
              $(err).html('' + e);
              $(err).show();
            }
            break;
          case 'js2lsrighteditor':
            try {
              cs = Js2coffee.build(scope.js2lslefteditor.getValue());
            } catch (e$) {
              e = e$;
              $(err).html('' + e);
              $(err).show();
            }
            break;
          case 'cs2lsrighteditor':
            cs = scope.cs2lslefteditor.getValue();
          }
          ls = '';
          try {
            ls = coffee2ls.compile(coffee2ls.parse(cs));
          } catch (e$) {
            e = e$;
            $(err).html('');
            $(err).append($('<pre/>').css('text-align', 'left').text(e));
            $(err).show();
            return;
          }
          switch (editor_id) {
          case 'js2lslefteditor':
          case 'js2lsrighteditor':
            if (!(editor_id === 'js2lslefteditor' && scope.righteditor_changed)) {
              try {
                scope.js2lsrighteditor.getSession().setValue(ls);
              } catch (e$) {}
              $('#left_arrow').css('display', 'none');
            }
            return scope.righteditor_changed === false;
          case 'cs2lslefteditor':
          case 'cs2lsrighteditor':
            try {
              return scope.cs2lsrighteditor.getSession().setValue(ls);
            } catch (e$) {}
          }
        };
        textarea = $(element).find('textarea');
        textarea.hide();
        mode = attrs.ace;
        editor = void 8;
        editor_id = attrs.id;
        switch (editor_id) {
        case 'js2lslefteditor':
        case 'js2lsrighteditor':
        case 'cs2lslefteditor':
          editor = loadAceEditor(element, mode, false);
          break;
        case 'cs2lsrighteditor':
          editor = loadAceEditor(element, mode, true);
        }
        err = void 8;
        switch (editor_id) {
        case 'js2lslefteditor':
        case 'js2lsrighteditor':
          err = '#js2lserror';
          break;
        case 'cs2lslefteditor':
        case 'cs2lsrighteditor':
          err = '#cs2lserror';
        }
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
    $('#js2ls').css('display', 'block');
    $('#cs2ls').css('display', 'none');
    $('#left_arrow').css('display', 'none');
    $scope.tabs = [
      {
        name: "JavaScript",
        selected: true,
        mode: "javascript"
      }, {
        name: "CoffeeScript",
        selected: false,
        mode: "coffee"
      }
    ];
    $scope.toggleTab = function(tabName){
      if ($scope.currentTab === tabName) {
        return;
      } else if ($scope.currentTab === 'JavaScript') {
        $scope.currentTab = 'CoffeeScript';
      } else if ($scope.currentTab === 'CoffeeScript') {
        $scope.currentTab = 'JavaScript';
      }
      angular.forEach($scope.tabs, function(tab){
        return tab.selected = $scope.currentTab === tab.name;
      });
      if ($scope.currentTab === 'JavaScript') {
        $('#js2ls').css('display', 'block');
        return $('#cs2ls').css('display', 'none');
      } else if ($scope.currentTab === 'CoffeeScript') {
        $('#cs2ls').css('display', 'block');
        $('#js2ls').css('display', 'none');
        return $('#left_arrow').css('display', 'none');
      }
    };
    return $scope.lsChangeHandler = function(){
      var ls, js, e;
      $scope.righteditor_changed = true;
      ls = $scope.js2lsrighteditor.getValue();
      js = '';
      try {
        js = coffee2ls.ls2js(ls);
      } catch (e$) {
        e = e$;
        $('#js2lserror').html('');
        $('#js2lserror').append($('<pre/>').css('text-align', 'left').text(e));
        $('#js2lserror').show();
        return;
      }
      $scope.js2lslefteditor.getSession().setValue(js);
      $('#left_arrow').css('display', 'none');
      return $scope.righteditor_changed = false;
    };
  };
  angular.module('myapp', ['ace']);
}});

