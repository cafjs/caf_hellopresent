# CAF (Cloud Assistant Framework)

Co-design permanent, active, stateful, reliable cloud proxies with your web app and gadget.

See http://www.cafjs.com

## A CAF example  implementing a presentation tool

Start creating a CA with name `admin` that manages all your presentations.

Using that instance, create a presentation `bar` by adding a binding to a URL containing the markdown (`slides.md` file by convention) and assets for your slides (see `caf_forward` and  `reveal.js` for details).

It is convenient to use a github repo. For example, if you are the user `foo`:

    foo-bar -> https://raw.githubusercontent.com/foo/my_presentations/master/presentation1

assuming that your `slides.md` file is in a repo `my_presentations` under subdir `presentation1`

and the presentation will show up when opening your instance `bar` of this app.
