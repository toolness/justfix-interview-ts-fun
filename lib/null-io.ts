import { InterviewIO, QuestionsFor } from "./interview-io";
import { Question, MultiChoiceAnswer } from "./question";
import { Photo } from "./util";

export class NullIO extends InterviewIO {
  ask<T>(question: Question<T>): Promise<T> {
    throw new NullIOError();
  }

  askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    throw new NullIOError();
  }

  notify(text: string): Promise<void> {
    throw new NullIOError();
  }

  setStatus(text: string): Promise<void> {
    throw new NullIOError();
  }

  createPhotoQuestion(text: string): Question<Photo> {
    throw new NullIOError();
  }

  createDateQuestion(text: string): Question<Date> {
    throw new NullIOError();
  }

  createMultiChoiceQuestion<T>(text: string, answers: MultiChoiceAnswer<T>[]): Question<T> {
    throw new NullIOError();
  }

  createYesNoQuestion(text: string): Question<boolean> {
    throw new NullIOError();
  }

  createNonBlankQuestion(text: string): Question<string> {
    throw new NullIOError();
  }
}

export class NullIOError extends Error {
  constructor() {
    super('IO methods on this object should never be called!');
  }
}
