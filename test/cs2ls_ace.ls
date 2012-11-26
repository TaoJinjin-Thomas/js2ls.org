should = (require \chai).should!
ua = new (require \zombie)
base_url = "file://#__dirname/../public/index.html"

# demo page rendering correctly checks
describe 'Home Page', -> ``it``
  .. 'cs2ls editor default text loaded successfully.', (done) ->
    # Load home page
    <- ua.visit base_url
    ua.success.should.be.ok
    $ = ua.window.jQuery

    # cs2ls left editor
    cs2lslefteditor = ($ \#cs2lslefteditor).data \editor

    # cs2ls right editor
    cs2lsrighteditor = ($ \#cs2lsrighteditor).data \editor

    # Defaults values to be shown in cs2ls editor
    cs2lsleft = '''
# Type Here!
$ ->
  $.fn.highlight = ->
    $(this).css
      color: "red"
      background: "yellow"
    $(this).fadeIn()
'''
    (cs2lslefteditor.get-session!.get-value!).should.eq cs2lsleft

    cs2lsright = '''
$ (->
  $.fn.highlight = ->
    ($ this).css {
      color: 'red'
      background: 'yellow'
    }
    ($ this).fadeIn!)
'''
    (cs2lsrighteditor.get-session!.get-value!).should.eq cs2lsright
    done!

  .. 'cs2ls left editor text changed successfully.', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    $ = ua.window.jQuery

    # cs2ls left editor
    cs2lslefteditor = ($ \#cs2lslefteditor).data \editor

    # cs2ls right editor
    cs2lsrighteditor = ($ \#cs2lsrighteditor).data \editor

    cs2lsleft = '''
# Type here!

days =
  monday: 1
  tuesday: 2
  wednesday: 3
  thursday: 4
  friday: 5
  saturday: 6
  sunday: 7
  
if yesterday is thursday
  today = friday
  we.excited()
  we.have ball: today
'''
    cs2lsright = '''
days = {
  monday: 1
  tuesday: 2
  wednesday: 3
  thursday: 4
  friday: 5
  saturday: 6
  sunday: 7
}

if yesterday is thursday
  today = friday
  we.excited!
  we.have {ball: today}
'''
    # set js2lslefteditor to js2lsleft
    cs2lslefteditor.get-session!.set-value cs2lsleft
    (cs2lsrighteditor.get-session!.get-value!).should.eq cs2lsright

    # left-arrow should be invisible
    (($ \#left_arrow).css \display).should.eq \none

    done! 
