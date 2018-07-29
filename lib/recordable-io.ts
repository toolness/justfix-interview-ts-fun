import { InterviewIO, QuestionsFor } from "./interview-io";
import { Question, MultiChoiceAnswer } from "./question";
import { Photo } from "./util";
import { Recorder, RecordedAction } from "./recorder";

export type IoActionType = 'ask'|'askMany'|'notify'|'setStatus'|'sleep';

/**
 * This class can be used to record interview phases that are
 * only partially completed, for playback at a later time. It
 * can be useful to e.g. resume a partly-completed sequence of
 * interview questions that only return a final state
 * change after the full sequence is answered.
 */
export class RecordableInterviewIO extends InterviewIO {
  readonly recorder: Recorder<IoActionType>;

  constructor(readonly delegate: InterviewIO, private readonly recording: RecordedAction<IoActionType>[] = []) {
    super();
    this.recorder = new Recorder(recording);
  }

  ask<T>(question: Question<T>): Promise<T> {
    return this.recorder.playbackOrRecord('ask', () => this.delegate.ask(question));
  }

  askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    return this.recorder.playbackOrRecord('askMany', () => this.delegate.askMany(questions));
  }

  notify(text: string) {
    return this.recorder.playbackOrRecord('notify', () => this.delegate.notify(text));
  }

  setStatus(text: string) {
    return this.recorder.playbackOrRecord('setStatus', () => this.delegate.setStatus(text));
  }

  sleep(ms: number) {
    return this.recorder.playbackOrRecord('sleep', () => this.delegate.sleep(ms));
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
