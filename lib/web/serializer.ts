export class LocalStorageSerializer<S> {
  constructor(readonly keyname: string, readonly defaultState: S) {
    this.keyname = keyname;
    this.defaultState = defaultState;
  }

  get(): S {
    try {
      const contents = window.localStorage[this.keyname];
      return JSON.parse(contents);
    } catch (e) {
      return this.defaultState;
    }
  }

  set(state: S) {
    const contents = JSON.stringify(state, null, 2);
    window.localStorage[this.keyname] = contents;
  }
}
