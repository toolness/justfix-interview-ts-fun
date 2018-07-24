This is an experiment in creating a medium-independent interview
logic for the second version of [JustFix.nyc][]'s tenant app.

## Quick start

You will need NodeJS 8.x or later.

```
npm install
npm run build
npm start
```

This will run the CLI version of the interview.

You can also run `npm start -- --help` for more information.

## Web front-end

There's also a web-based version of the interview. To run it,
use:

```
npm run serve
```

Your web browser will automatically be opened to the
appropriate URL.

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

Instead of constantly running `npm run build` whenever you
make changes to the source code, you can run `npm run watch` in
a separate terminal window. This will watch your source files
for changes and rebuild as needed.

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
