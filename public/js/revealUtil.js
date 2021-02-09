'use strict';
const Reveal = require('reveal.js');
const Markdown = require('reveal.js/plugin/markdown/markdown.js');
const Highlight = require('reveal.js/plugin/highlight/highlight.js');

const AppActions = require('./actions/AppActions');

const request = require('superagent');

const MARKDOWN_SECTION_ID = 'markdownSectionId';

const patchMarkdown = async function(data) {
    const markElem = document && document.getElementById(MARKDOWN_SECTION_ID);
    if (markElem && data.markdownURL) {
        const res = await request.get(data.markdownURL);
        const prefix = data.markdownURL.split('/')[0];
        let text = res.text.replace(/process.env.CA_NAME/g, prefix);
        text = 'data:text/x-markdown;charset=utf-8;base64,' +
            window.btoa(text);
        markElem.setAttribute('data-markdown', text);
    } else {
        throw new Error('Missing markdown section');
    }
};

exports.init = async function(ctx, data) {
    const firstSlide = data.currentPage &&
        (typeof data.currentPage.num === 'number') ?
        data.currentPage.num :
        null;

    Reveal.addEventListener('ready', function() {
        if (data.print) {
	    const link = document.createElement( 'link' );
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
            const prev = Reveal.getIndices(event.previousSlide).h;
            const cur = Reveal.getIndices(event.currentSlide).h;
            if (prev !== cur) {
                AppActions.changePage(ctx, prev, cur);
            }
        }
    });

    await patchMarkdown(data);

    Reveal.initialize({
        history: false,
        progress: false,
        controls: false,
        center: false,
        slideNumber: true,
        transition: 'none',
        transitionSpeed: 'fast',
        plugins: [ Markdown, Highlight]
    });
};
