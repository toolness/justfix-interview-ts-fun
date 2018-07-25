This is an experiment in creating a medium-independent interview
logic for the second version of [JustFix.nyc][]'s tenant app.

## Quick start

You will need NodeJS 8.x or later.

```
npm install
npm run watch
```

Now you can run either the console or web version of
the interview.

### Console front-end

To use the console version of the interview, open
a separate terminal and run:

```
node console/bundle.js
```

You can also pass `--help` for more information.

### Web front-end

The `npm run watch` command also launches a web server, so
to visit the web front-end, open your browser to
http://localhost:8080.

## Motivation

This experiment uses a combination of strong typing and
functional programming paradigms to separate the interview
logic from any specific communication medium--SMS, Web,
et cetera--and ensure a reliable user experience that can be easily
tested and iterated upon.

That said, it might also be a terrible idea. We'll see.

## Development

Aside from Node JS, this project uses [TypeScript][], so
you may want to familiarize yourself with that before
changing the source code. It's strongly recommended that
you install any [TypeScript integration][] available for
your editor of choice.

## Deployment

The web version of the prototype can be deployed to the repository's
`gh-pages` branch by running:

```
npm run deploy
```

## Visual Studio Code support

This project supports [JSON Schema integration][] with [VS Code][].
To enable it, run:

```
npm run schema
```

You'll need to re-run this whenever you update relevant parts of the
codebase, as the JSON Schema is generated from the TypeScript type
definitions.

[JustFix.nyc]: https://www.justfix.nyc/
[TypeScript]: https://www.typescriptlang.org/
[Typescript integration]: https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support
[JSON Schema integration]: https://code.visualstudio.com/docs/languages/json#_json-schemas-settings
[VS Code]: https://code.visualstudio.com/
