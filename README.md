# CAF (Cloud Assistant Framework)

Co-design permanent, active, stateful, reliable cloud proxies with your web app and gadget.

See http://www.cafjs.com

## A CAF example  implementing a presentation tool

Learns during rehearsal how long it takes you to present a set of `Reveal.js` slides. Then, in the middle of the actual presentation, it will send you a warning SMS if you are not going to make it.

Start by creating a CA with name `admin` that manages all your presentations.

Using that instance, create a presentation `bar` by adding a binding to a URL containing the markdown (`slides.md` file by convention) and assets for your slides (see `caf_forward` and  `reveal.js` for details).

It is convenient to use a github repo. For example, if you are the user `foo`:

    foo-bar -> https://rawgit.com/foo/my_presentations/master/presentation1

assuming that your `slides.md` file is in a repo `my_presentations` under subdir `presentation1` in github.

And the presentation will show up when opening your instance `bar` of this app.

Note that `rawgit.com` ensures that the content type for svg and other special files is not just `text/plain`. See http://rawgit.com/ for details.

It is also easy to run in local mode, useful when editing slides. Create a symbolic link to your slides directory in `caf_hellopresent/public/slides`, run `dcinabox` mounting your home directory (assuming it contains your slides), and set the link as:

    foo-bar -> http://127.0.0.1:3000/slides

To run `caf_hellopresent` with `dcinabox`, first `npm install` and `npm run build`. Then:

    caf/tools/caf_dcinabox/dcinabox.js --appLocalName hellopresent --appImage registry.cafjs.com:32000/root-generic --appWorkingDir $PWD --hostVolume $HOME --appVolume $HOME

   where the current directory `$PWD` should be `caf/app/caf_hellopresent`
