# Caf.js

Co-design permanent, active, stateful, reliable cloud proxies with your web app and gadget.

See https://www.cafjs.com

## Example of a Presentation Tool

Learns during rehearsal how long it takes you to present a set of `Reveal.js` slides. Then, in the middle of the actual presentation, it will send you a warning SMS if you are not going to make it.

Start by creating a CA with name `admin` that manages all your presentations.

Using that instance, create a presentation `bar` by adding a binding to a URL containing the markdown (`slides.md` file by convention) and assets for your slides (see `caf_forward` and  `reveal.js` for details). Assets with a relative path should be prefixed by `process.env.CA_NAME`, for example:

    ![](process.env.CA_NAME/assets/overview.svg)
    <!-- .element:  width="500" heigh="500" -->

It is convenient to use a github repo. For example, if you are the user `foo`:

    foo-bar -> https://cdn.jsdelivr.net/gh/foo/my_presentations/presentation1

assuming that your `slides.md` file is in a repo `my_presentations` under subdir `presentation1` in github.

And the presentation will show up when opening your instance `bar` of this app.

Note that `cdn.jsdelivr.net` ensures that the mime type for svg and other special files is not just `text/plain`. See http://cdn.jsdelivr.net/ for details.

It is also easy to run in local mode, useful when editing slides. Create a symbolic link to your slides directory in `caf_hellopresent/public/slides`, run `cafjs` tools mounting your home directory (assuming it contains your slides), and set the link as:

    foo-bar -> http://127.0.0.1:3000/slides

To run the app `caf_hellopresent` locally with the `cafjs` tools, see https://cafjs.github.io/api/caf_dcinabox
