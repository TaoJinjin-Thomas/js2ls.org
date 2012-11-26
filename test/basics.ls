should = (require \chai).should!
ua = new (require \zombie)
# Tried DOM extending to add dummy method to avoid TypeErrors as follows.
# HTMLDivElement::getBoundingClientRect = -> this in controllers.ls
# though TypeErrors are gone, RangeErrors are coming and ace-editor layout is disturbed.
# temporarily disable console.log until we come across a solution for that.
#ua.silent = \true
base_url = "file://#__dirname/../public/index.html"

# demo page rendering correctly checks
describe 'Home Page', -> ``it``
  .. 'loaded successfully.', (done) ->
    # Load home page
    <- ua.visit base_url
    ua.success.should.be.ok
    done!

  # check for js2ls, cs2ls divs
  .. 'contain js2ls, cs2ls div elements.', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    # document object
    ua.document.should.exist
    # js2ls div and its related 
    ua.query('div#js2ls').should.exist
    ua.query('div#js2lslefteditor').should.exist
    # (ACE left editor)
    ua.query('div#js2lsrighteditor').should.exist
    # (ACE right editor)
    # cs2ls div and its related 
    ua.query('div#cs2ls').should.exist
    ua.query('div#cs2lslefteditor').should.exist
    ua.query('div#cs2lsrighteditor').should.exist
    done!

  .. 'contains JavaScript, CoffeeScript tabs.', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    document = ua.document
    li_eles = document.querySelectorAll 'li[class^="selected"]'
    # Total we have 2 tabs with selected-(true|false) class
    li_eles.should.have.length 2
    # JavaScript tab should be selected by default
    (ua.text 'li[class="selected-true"]').should.eq 'JavaScript'
    # CoffeeScript tab should not be selected by default
    (ua.text 'li[class="selected-false"]').should.eq 'CoffeeScript'
    done!

  .. 'JavaScript tab default selected', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    # JavaScript tab should be selected by default
    (ua.text 'li[class="selected-true"]').should.eq 'JavaScript'
    # CoffeeScript tab should not be selected by default
    (ua.text 'li[class="selected-false"]').should.eq 'CoffeeScript'
    done!

  .. 'Click CoffeeScript tab', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    cs_tab = ua.query 'li[class="selected-false"]'

    # Now click CoffeeScript tab
    <- ua.fire \click cs_tab
    (ua.text 'li[class="selected-true"]').should.eq 'CoffeeScript'
    # CoffeeScript tab should be selected
    # JavaScriptScript tab should not be selected
    (ua.text 'li[class="selected-false"]').should.eq 'JavaScript'
    js_tab = ua.query 'li[class="selected-false"]'

    # Now try to swap tabs
    <- ua.fire \click js_tab
    (ua.text 'li[class="selected-true"]').should.eq 'JavaScript'
    # JavaScript tab should be selected
    # CoffeeScript tab should not be selected
    (ua.text 'li[class="selected-false"]').should.eq 'CoffeeScript'

    done!

  .. 'Left arrow is hidden by default', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    # left arrow anchor tag
    ua.query('a#left_arrow').should.exist;
    # left arrow display style should be none
    $ = ua.window.jQuery;
    (($ '#left_arrow').css 'display').should.eq 'none'
    done!
