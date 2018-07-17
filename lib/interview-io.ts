import { Question, ValidationError } from './question';
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
export interface InterviewIO {
  /** 
   * Ask a question of the user. If the user provides invalid input, keep asking.
   * @param question The question to ask.
   */
  ask<T>(question: Question<T>): Promise<T>;

  /**
   * Ask a number of questions of the user. Some user interfaces,
   * such as screens, may present the questions as a single form.
   * 
   * @param questions A mapping from string keys to questions. The
   *   return value will contain the answers, mapped using the same keys.
   */
  askMany<T>(questions: QuestionsFor<T>): Promise<T>;

  /**
   * Notify the user with important information.
   */
  notify(text: string): void;

  /**
   * Create a question that asks for a photo.
   */
  createPhotoQuestion(text: string): Question<Photo>;
}
