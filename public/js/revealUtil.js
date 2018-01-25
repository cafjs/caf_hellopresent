var Reveal = require('../reveal/js/reveal.js');
if (global) {
    // plugin markdown assumes Reveal is global
    global.Reveal = Reveal;
}
var AppActions = require('./actions/AppActions');

var hljs = require('highlight.js');
var request = require('superagent');

var MARKDOWN_SECTION_ID = 'markdownSectionId';

var patchMarkdown = function(data, cb) {
    var markElem = document && document.getElementById(MARKDOWN_SECTION_ID);
    if (markElem && data.markdownURL) {
        request
            .get(data.markdownURL)
            .end(function(err, res) {
                if (err) {
                    cb(err);
                } else {
                    var prefix = data.markdownURL.split('/')[0];
                    var text = res.text.replace(/process.env.CA_NAME/g, prefix);
                    text = 'data:text/x-markdown;charset=utf-8;base64,' +
                        window.btoa(text);
                    markElem.setAttribute('data-markdown', text);
                    cb(null);
                }
            });
    } else {
        cb(new Error('Missing markdown section'));
    }
};

exports.init = function(ctx, data) {
    var firstSlide = null;

    Reveal.addEventListener('ready', function() {
        hljs.initHighlighting();
        if (data.print) {
	    var link = document.createElement( 'link' );
	    link.rel = 'stylesheet';
	    link.type = 'text/css';
	    link.href = 'reveal/css/print/pdf.css';
	    document.getElementsByTagName('head')[0].appendChild(link);
        } else if (typeof firstSlide === 'number') {
            Reveal.slide(firstSlide, 0, 0);
        }

        console.log('READY!');
    });

    Reveal.addEventListener('slidechanged', function(event) {
        if (event.previousSlide && event.currentSlide &&
            (event.previousSlide !== event.currentSlide)) {
            var prev = Reveal.getIndices(event.previousSlide).h;
            var cur = Reveal.getIndices(event.currentSlide).h;
            if (prev !== cur) {
                AppActions.changePage(ctx, prev, cur);
            }
        }
    });

    patchMarkdown(data, function(err) {
        if (err) {
            console.log(err);
        } else {
            Reveal.initialize({
                history: false,
                progress: false,
                controls: false,
                center: false,
                slideNumber: true,
                transition: 'none',
                transitionSpeed: 'fast',
                dependencies: [
	            {
                        src: 'reveal/plugin/markdown/marked.js',
                        condition: function() {
                            return !!document.querySelector('[data-markdown]');
                        }
                    },
                    {
                        src: 'reveal/plugin/markdown/markdown.js',
                        condition: function() {
                            return !!document.querySelector('[data-markdown]');
                        }
                    }
	        ]
            });

            firstSlide = (data.currentPage &&
                          (typeof data.currentPage.num === 'number') ?
                          data.currentPage.num : null);
        }
    });
};
