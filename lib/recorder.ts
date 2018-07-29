import { EventEmitter } from "events";

export type RecordedAction<ActionType> = [ActionType, any];

export class Recorder<ActionType> extends EventEmitter {
  private readonly newRecording: RecordedAction<ActionType>[];

  constructor(private readonly recording: RecordedAction<ActionType>[] = []) {
    super();
    this.recording = recording.slice();
    this.newRecording = recording.slice();
  }

  getRecording(): RecordedAction<ActionType>[] {
    return this.newRecording.slice();
  }

  resetRecording(): RecordedAction<ActionType>[] {
    this.recording.splice(0);
    this.newRecording.splice(0);
    return this.getRecording();
  }

  async playbackOrRecord<T>(type: ActionType, record: () => Promise<T>): Promise<T> {
    const result = this.recording.shift();
    if (result !== undefined) {
      const [actualType, value] = result;
      if (actualType !== type) {
        throw new Error(`Expected recorded action of type ${type} but got ${actualType}`);
      }
      return Promise.resolve(value);
    } else {
      this.emit('begin-recording-action', type);
      const result = await record();
      this.newRecording.push([type, result]);
      return result;
    }
  }
}

export interface Recorder<ActionType> {
  on(event: 'begin-recording-action', listener: (type: ActionType) => void): this;
  emit(event: 'begin-recording-action', type: ActionType): boolean;
}
