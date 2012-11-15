should = (require 'chai').should!
Browser = require 'zombie'
browser = new Browser
base_url = 'http://localhost:3333/'

# demo page rendering correcly checks
describe 'Home Page', -> ``it``
  .. 'loaded successfully.', (done) ->
    # Load home page
    browser.visit base_url, ->
      browser.success.should.be.ok
      done!
  # check for js2ls, cs2ls divs
  .. 'contain js2ls, cs2ls div elements.', (done) ->
    browser.visit base_url, ->
      browser.success.should.be.ok
      # document object
      document = browser.document
      # js2ls div and its related 
      (document.querySelector 'div#js2ls').should.exist
      (document.querySelector 'div#js2lslefteditor').should.exist
      # (ACE left editor)
      (document.querySelector 'div#js2lsrighteditor').should.exist
      # (ACE right editor)
      # cs2ls div and its related 
      (document.querySelector 'div#cs2ls').should.exist
      (document.querySelector 'div#cs2lslefteditor').should.exist
      (document.querySelector 'div#cs2lsrighteditor').should.exist
      done!
  .. 'contains JavaScript, CoffeeScript tabs.', (done) ->
    browser.visit base_url, (err, browser) ->
      browser.success.should.be.ok
      document = browser.document
      li_eles = document.querySelectorAll 'li[class^="selected"]'
      # Total we have 2 tabs with selected-(true|false) class
      li_eles.should.have.length 2
      # JavaScript tab should be selected by default
      (browser.text 'li[class="selected-true"]').should.eq 'JavaScript'
      # CoffeeScript tab should not be selected by default
      (browser.text 'li[class="selected-false"]').should.eq 'CoffeeScript'
      done!
  .. 'JavaScript tab default selected', (done) ->
    browser.visit base_url, (err, browser) ->
      browser.success.should.be.ok
      # JavaScript tab should be selected by default
      (browser.text 'li[class="selected-true"]').should.eq 'JavaScript'
      # CoffeeScript tab should not be selected by default
      (browser.text 'li[class="selected-false"]').should.eq 'CoffeeScript'
      done!
  # TODO. 
  # Skipping this test as AngularJS ng-click event is not fired by Zombie.
  # trying to identify and fixing this issue currently
  ..skip 'Click CoffeeScript tab', (done) ->
    browser.visit base_url, ->
      browser.success.should.be.ok
      cs_tab = browser.query 'li[class="selected-false"]'
      console.log 'cs_tab text = ' + browser.text 'li[class="selected-false"]'
      # Now click CoffeeScript tab
      browser.fire 'click', cs_tab, (done) ->
        (browser.text 'li[class="selected-true"]').should.eq 'CoffeeScript'
        #console.log(browser.html());
        # CoffeeScript tab should be selected
        # JavaScriptScript tab should not be selected
        (browser.text 'li[class="selected-false"]').should.eq 'JavaScript'
        done!
      js_tab = browser.query 'li[class="selected-false"]'
      # Now try to swap tabs
      browser.fire 'click', js_tab, (done) ->
        (browser.text 'li[class="selected-true"]').should.eq 'JavaScript'
        # JavaScript tab should be selected
        # CoffeeScript tab should not be selected
        (browser.text 'li[class="selected-false"]').should.eq 'CoffeeScript'
        done!
