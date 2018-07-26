export interface VersionedState {
  version: number;
}

export class LocalStorageSerializer<S extends VersionedState> {
  constructor(readonly keyname: string, readonly defaultState: S, readonly version: number) {
    if (defaultState.version !== version) {
      throw new Error(`Default state's version (${defaultState.version}) must match version (${version})`);
    }
  }

  private ensureVersion(state: S) {
    const version = state && state.version;
    if (version !== this.version) {
      throw new Error(`invalid version, expected ${this.version} but got ${version}`);
    }
  }

  get(): S {
    try {
      const contents = window.localStorage[this.keyname];
      const state = JSON.parse(contents);
      this.ensureVersion(state);
      return state;
    } catch (e) {
      return this.defaultState;
    }
  }

  set(state: S) {
    this.ensureVersion(state);
    const contents = JSON.stringify(state, null, 2);
    window.localStorage[this.keyname] = contents;
  }
}
