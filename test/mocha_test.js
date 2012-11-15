var Browser = require('zombie');
var assert = require('assert');
browser = new Browser();

var base_url = 'http://localhost:3333/';

// demo page rendering correcly checks
describe('Home Page', function() {

  // Load home page
  it('loaded successfully.', function(done) {

    browser.visit(base_url, function() {

      assert.ok(browser.success, "should return HTTP status code 2xx.");
      done();

    });
  });

  // check for js2ls, cs2ls divs
  it('contain js2ls, cs2ls div elements.', function(done) {

    browser.visit(base_url, function() {

      assert.ok(browser.success, "should return HTTP status code 2xx.");

      // document object
      var document = browser.document;

      /* js2ls div and its related */
      assert.ok(document.querySelector('div#js2ls'), "should contain js2ls div element");
      assert.ok(document.querySelector('div#js2lslefteditor'), "should contain js2lslefteditor div element (ACE left editor)");
      assert.ok(document.querySelector('div#js2lsrighteditor'), "should contain js2lsrighteditor div element (ACE right editor)");

      /* cs2ls div and its related */
      assert.ok(document.querySelector('div#cs2ls'), "should contain cs2ls div element");
      assert.ok(document.querySelector('div#cs2lslefteditor'), "should contain cs2lslefteditor div element (ACE left editor)");
      assert.ok(document.querySelector('div#cs2lsrighteditor'), "should contain cs2lsrighteditor div element (ACE right editor)");
      done();

    });
  });
  
  it('contains JavaScript, CoffeeScript tabs.', function(done) {

    browser.visit(base_url, function(err, browser) {
      
      assert.ok(browser.success, "should return HTTP status code 2xx.");

      var document = browser.document;
      var li_eles = document.querySelectorAll('li[class^="selected"]');

      // Total we have 2 tabs with selected-(true|false) class
      assert.equal(2, li_eles.length, "should contain 2 li elements with selected-(true|false) class");
      
      // JavaScript tab should be selected by default
      assert.ok("JavaScript" == browser.text('li[class="selected-true"]'), "JavaScript tab should be selected");

      // CoffeeScript tab should not be selected by default
      assert.ok("CoffeeScript" == browser.text('li[class="selected-false"]'), "CoffeeScript tab should not be selected");

      done();

    });
  });

  it('JavaScript tab default selected', function(done) {

    browser.visit(base_url, function(err, browser) {
      
      assert.ok(browser.success, "should return HTTP status code 2xx.");

      // JavaScript tab should be selected by default
      assert.ok("JavaScript" == browser.text('li[class="selected-true"]'), "JavaScript tab should be selected");

      // CoffeeScript tab should not be selected by default
      assert.ok("CoffeeScript" == browser.text('li[class="selected-false"]'), "JavaScript tab should be selected");

      done();

    });
  });

  // TODO. 
  // Skipping this test as AngularJS ng-click event is not fired by Zombie.
  // trying to identify and fixing this issue currently
  it.skip('Click CoffeeScript tab', function(done) {

    browser.visit(base_url, function() {

      assert.ok(browser.success, "should return HTTP status code 2xx");

      var cs_tab = browser.query('li[class="selected-false"]');
      console.log('cs_tab text = ' + browser.text('li[class="selected-false"]'));

      // Now click CoffeeScript tab
      browser.fire('click', cs_tab, function(done) {
        //console.log(browser.html());
        // CoffeeScript tab should be selected
        assert.ok("CoffeeScript" == browser.text('li[class="selected-true"]'), "CoffeeScript tab should be selected");

        // JavaScriptScript tab should not be selected
        assert.ok("JavaScript" == browser.text('li[class="selected-false"]'), "JavaScript tab should not be selected");

        done();

      });

      var js_tab = browser.query('li[class="selected-false"]');
      
      // Now try to swap tabs
      browser.fire('click', js_tab, function(done) {

        // JavaScript tab should be selected
        assert.ok("JavaScript" == browser.text('li[class="selected-true"]'), "JavaScript tab should be selected");

        // CoffeeScript tab should not be selected
        assert.ok("CoffeeScript" == browser.text('li[class="selected-false"]'), "CoffeeScript tab should not be selected");

        done();

      });

    });

  });
});
