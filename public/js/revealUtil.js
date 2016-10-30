var Reveal = require('../reveal/js/reveal.js');
var AppActions = require('./actions/AppActions');

var hljs = require('highlight.js');

var MARKDOWN_SECTION_ID = 'markdownSectionId';


exports.init = function(ctx, data) {
    var firstSlide = null;

    Reveal.addEventListener('ready', function() {
        hljs.initHighlighting();
        if (typeof firstSlide === 'number') {
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

    var markElem = document && document.getElementById(MARKDOWN_SECTION_ID);
    if (markElem && data.markdownURL) {
        markElem.setAttribute('data-markdown', data.markdownURL);
    }

    Reveal.initialize({
        history: false,
        progress: false,
        controls: false,
        center: false,
        slideNumber: true,
        transition: 'none',
        transitionSpeed: 'fast',
        dependencies: [
	    { src: 'reveal/plugin/markdown/marked.js',
              condition: function() {
                  return !!document.querySelector( '[data-markdown]' );
              }
            },
            { src: 'reveal/plugin/markdown/markdown.js',
              condition: function() {
                  return !!document.querySelector( '[data-markdown]' );
              }
            }
	]
    });

    firstSlide = (data.currentPage &&
                  (typeof data.currentPage.num === 'number') ?
                  data.currentPage.num : null);
};
