should = (require \chai).should!
ua = new (require \zombie)
base_url = "file://#__dirname/../public/index.html"

# demo page rendering correctly checks
describe 'Home Page', -> ``it``
  .. 'js2ls editor default text loaded successfully.', (done) ->
    # Load home page
    <- ua.visit base_url
    ua.success.should.be.ok
    $ = ua.window.jQuery

    # js2ls left editor
    js2lslefteditor = ($ \#js2lslefteditor).data \editor

    # js2ls right editor
    js2lsrighteditor = ($ \#js2lsrighteditor).data \editor

    # Defaults values to be shown in js2ls and cs2ls editors
    js2lsleft = '''
/* Type JavaScript here! */
(function () {
  $.fn.highlight = function () {
    $(this).css({ color: 'red', background: 'yellow' });
    $(this).fadeIn();
  };
})(jQuery);
'''
    (js2lslefteditor.get-session!.get-value!).should.eq js2lsleft

    js2lsright = '''
(->
  $.fn.highlight = ->
    ($ this).css {
      color: 'red'
      background: 'yellow'
    }
    ($ this).fadeIn!) jQuery
'''

    (js2lsrighteditor.get-session!.get-value!).should.eq js2lsright
    done!

  .. 'js2ls left editor text changed successfully.', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    $ = ua.window.jQuery

    # js2ls left editor
    js2lslefteditor = ($ \#js2lslefteditor).data \editor

    # js2ls right editor
    js2lsrighteditor = ($ \#js2lsrighteditor).data \editor

    js2lsleft = '''
var string;
'hello' + ' ' + 'world';
string = 'say ';
string += 'yeah';
'''
    js2lsright = '''
string = void

'hello' + ' ' + 'world'

string = 'say '

string += 'yeah'
'''
    # set js2lslefteditor to js2lsleft
    js2lslefteditor.get-session!.set-value js2lsleft
    (js2lsrighteditor.get-session!.get-value!).should.eq js2lsright

    # left-arrow should be invisible
    (($ \#left_arrow).css \display).should.eq \none

    done! 

  .. 'js2lsright editor text changed successfully.', (done) ->
    <- ua.visit base_url
    ua.success.should.be.ok
    $ = ua.window.jQuery

    # js2ls left editor
    js2lslefteditor = ($ \#js2lslefteditor).data \editor

    # js2ls right editor
    js2lsrighteditor = ($ \#js2lsrighteditor).data \editor

    # current text in editors
    js2lsleft = js2lslefteditor.get-session!.get-value!
    js2lsright = js2lsrighteditor.get-session!.get-value!

    # set js2lsrighteditor to text
    js2lsright_new = '''
filter-nums = filter _, [1 to 5]
filter-nums even  #=> [2,4]
filter-nums odd   #=> [1,3,5]
filter-nums (< 3) #=> [1,2]
'''

    # expected text in js2lslefteditor after left-arrow button click
    js2lsleft_new = '''
var filterNums, slice$ = [].slice;
filterNums = partialize$(filter, [void 8, [1, 2, 3, 4, 5]], [0]);
filterNums(even);
filterNums(odd);
filterNums((function(it){
  return it < 3;
}));
function partialize$(f, args, where){
  return function(){
    var params = slice$.call(arguments), i,
        len = params.length, wlen = where.length,
        ta = args ? args.concat() : [], tw = where ? where.concat() : [];
    for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
    return len < wlen && len ? partialize$(f, ta, tw) : f.apply(this, ta);
  };
}
'''
    # change js2lsrighteditor text
    js2lsrighteditor.get-session!.set-value js2lsright_new

    # validate right editor text is set correctly
    (js2lsrighteditor.get-session!.get-value!).should.eq js2lsright_new

    # js2ls left editor should be unchanged automatically
    (js2lslefteditor.get-session!.get-value!).should.eq js2lsleft

    # left-arrow should be visible
    (($ \#left_arrow).css \display).should.not.eq \none

    # Now fire click event on left-arrow
    # TODO, left_arrow click event is not caught, always gives timeout error
    #left_arrow = ua.query 'a#left_arrow'
    #<- ua.fire \click left_arrow

    # left-arrow should be hiden now
    #(($ \#left_arrow).css \display).should.eq \none

    # check js2lslefteditor is set with expected text
    #console.log(js2lslefteditor.get-session!.get-value!)
    #(js2lslefteditor.get-session!.get-value!).should.eq js2lsleft_new

    done!
