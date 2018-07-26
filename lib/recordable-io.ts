import { InterviewIO, QuestionsFor } from "./interview-io";
import { Question, MultiChoiceAnswer } from "./question";
import { Photo } from "./util";

export type IoActionType = 'ask'|'askMany'|'notify'|'setStatus';

export type RecordedAction = [IoActionType, any];

/**
 * This class can be used to record interview phases that are
 * only partially completed, for playback at a later time. It
 * can be useful to e.g. resume a partly-completed sequence of
 * interview questions that only return a final state
 * change after the full sequence is answered.
 */
export class RecordableInterviewIO extends InterviewIO {
  private readonly newRecording: RecordedAction[];

  constructor(readonly delegate: InterviewIO, private readonly recording: RecordedAction[] = []) {
    super();
    this.recording = recording.slice();
    this.newRecording = recording.slice();
  }

  getRecording(): RecordedAction[] {
    return this.newRecording.slice();
  }

  resetRecording(): RecordedAction[] {
    this.recording.splice(0);
    this.newRecording.splice(0);
    return this.getRecording();
  }

  private async playbackOrRecord<T>(type: IoActionType, record: () => Promise<T>): Promise<T> {
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

  ask<T>(question: Question<T>): Promise<T> {
    return this.playbackOrRecord('ask', () => this.delegate.ask(question));
  }

  askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    return this.playbackOrRecord('askMany', () => this.delegate.askMany(questions));
  }

  notify(text: string) {
    return this.playbackOrRecord('notify', () => this.delegate.notify(text));
  }

  setStatus(text: string) {
    return this.playbackOrRecord('setStatus', () => this.delegate.setStatus(text));
  }

  createPhotoQuestion(text: string): Question<Photo> {
    return this.delegate.createPhotoQuestion(text);
  }

  createDateQuestion(text: string): Question<Date> {
    return this.delegate.createDateQuestion(text);
  }

  createMultiChoiceQuestion<T>(text: string, answers: MultiChoiceAnswer<T>[]): Question<T> {
    return this.delegate.createMultiChoiceQuestion(text, answers);
  }

  createYesNoQuestion(text: string): Question<boolean> {
    return this.delegate.createYesNoQuestion(text);
  }

  createNonBlankQuestion(text: string): Question<string> {
    return this.delegate.createNonBlankQuestion(text);
  }
}

export interface RecordableInterviewIO {
  on(event: 'begin-recording-action', listener: (type: IoActionType) => void): this;
  emit(event: 'begin-recording-action', type: IoActionType): boolean;
}
