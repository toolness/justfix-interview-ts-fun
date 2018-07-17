import * as fs from 'fs';

const ENCODING = 'utf-8';

export class FileSerializer<S> {
  constructor(readonly filename: string, readonly defaultState: S) {
    this.filename = filename;
    this.defaultState = defaultState;
  }

  get(): S {
    try {
      const contents = fs.readFileSync(this.filename, { encoding: ENCODING });
      return JSON.parse(contents);
    } catch (e) {
      return this.defaultState;
    }
  }

  set(state: S) {
    const contents = JSON.stringify(state, null, 2);
    fs.writeFileSync(this.filename, contents, { encoding: ENCODING });
  }
}
