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
