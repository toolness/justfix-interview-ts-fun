import * as readline from 'readline';
import * as stream from 'stream';

import { Question, ValidationError } from './question';

/**
 * This is a mapped type [1] consisting of properties that consist
 * of questions whose answers map to the original property types.
 * 
 * [1] https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
type QuestionsFor<T> = {
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
}

/** Standard interview i/o that uses readline/stdout. */
export class ReadlineInterviewIO implements InterviewIO {
  private rl: readline.ReadLine;
  private output: NodeJS.WriteStream;
  private isAsking: boolean;

  /**
   * @param rl A ReadLine object for the interview. If not provided, stdio will be used.
   * @param output The stream to which output will be written. Defaults to stdout.
   */
  constructor(rl?: readline.ReadLine, output?: NodeJS.WriteStream) {
    this.isAsking = false;
    this.output = output || process.stdout;
    this.rl = rl || readline.createInterface({
      input: process.stdin,
      output: this.output
    });
  }

  /** This is just a promisified wrapper around ReadLine.question(). */
  private askRaw(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.rl.question(query, answer => {
        resolve(answer);
      });
    });
  }

  async ask<T>(question: Question<T>): Promise<T> {
    if (this.isAsking) {
      throw new Error('Assertion failure, we are already asking a question!');
    }

    this.isAsking = true;
    const rawAnswer = await this.askRaw(`${question.text} `);
    const result = await question.processResponse(rawAnswer);
    this.isAsking = false;

    if (result instanceof ValidationError) {
      this.output.write(`${result.message}\n`);
      return this.ask(question);
    }

    return result;
  }

  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    const result = {} as T;

    for (let key in questions) {
      result[key] = await this.ask(questions[key]);
    }

    return result;
  }

  notify(text: string) {
    this.output.write(`${text}\n`);
  }

  /** Close the underlying ReadLine object. */
  close() {
    this.rl.close();
  }
}
