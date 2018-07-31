This is an experiment in creating a medium-independent interview
logic for the second version of [JustFix.nyc][]'s tenant app.

## Motivation

This experiment uses a combination of strong typing and
functional programming paradigms to separate the interview
logic from any specific communication medium--SMS, Web,
et cetera--and ensure a reliable user experience that can be easily
tested and iterated upon.

That said, it might also be a terrible idea. We'll see.

## Quick start

You will need NodeJS 8.x or later.

```
npm install
npm run watch
```

Now you can run either the console, web, or SMS version of
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

### SMS front-end

To simulate using the SMS version of the interview, run:

```
node sms/bundle.js simulate <SMS message text>
```

#### SMS webhook server

**Note: using the SMS webhook server requires
installing `package.json`'s optional dependencies.**

To use the SMS version of the interview from your
phone, open a separate terminal and run:

```
npm run sms
```

This will start a server on port 8081.  You will
want to point Twilio's incoming message webhook
to the `/sms` path on this server, probably via
a proxy like ngrok. This will also require buying
a phone number on Twilio.

Once you've got everything hooked up, send
a SMS with the text "hi" to your Twilio number.

For more details on configuring the server or
using the simulator, run:

```
node sms/bundle.js --help
```

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
