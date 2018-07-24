import {
  Question,
  DateQuestion,
  MultiChoiceAnswer,
  MultiChoiceQuestion,
  YesNoQuestion,
  NonBlankQuestion
} from './question';

import { Photo } from './util';

/**
 * This is a mapped type [1] consisting of properties that consist
 * of questions whose answers map to the original property types.
 * 
 * [1] https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
export type QuestionsFor<T> = {
  [P in keyof T]: Question<T[P]>;
};

/** 
 * This is any input/output mechanism by which the interview communicates with
 * the user.
 *
 * This interface has been designed to conduct interviews using multiple
 * communication media (voice, SMS, web, etc).
 */
export abstract class InterviewIO {
  /** 
   * Ask a question of the user. If the user provides invalid input, keep asking.
   * @param question The question to ask.
   */
  abstract ask<T>(question: Question<T>): Promise<T>;

  /**
   * Ask a number of questions of the user. Some user interfaces,
   * such as screens, may present the questions as a single form.
   * 
   * @param questions A mapping from string keys to questions. The
   *   return value will contain the answers, mapped using the same keys.
   */
  abstract askMany<T>(questions: QuestionsFor<T>): Promise<T>;

  /**
   * Notify the user with important information.
   */
  abstract notify(text: string): void;

  /**
   * Set the current status, so the user knows what is going on
   * if there are any delays.
   */
  setStatus(text: string): void {
  }

  /**
   * Create a question that asks for a photo.
   */
  abstract createPhotoQuestion(text: string): Question<Photo>;

  createDateQuestion(text: string): Question<Date> {
    return new DateQuestion(text);
  }

  createMultiChoiceQuestion<T>(text: string, answers: MultiChoiceAnswer<T>[]): Question<T> {
    return new MultiChoiceQuestion(text, answers);
  }

  createYesNoQuestion(text: string): Question<boolean> {
    return new YesNoQuestion(text);
  }

  createNonBlankQuestion(text: string): Question<string> {
    return new NonBlankQuestion(text);
  }
}
