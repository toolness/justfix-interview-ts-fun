import * as readline from 'readline';
import * as stream from 'stream';

import { Question, ValidationError } from './question';
import { resolve } from 'dns';

/**
 * This is a mapped type [1] consisting of properties that consist
 * of questions whose answers map to the original property types.
 * 
 * [1] https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
type QuestionsFor<T> = {
  [P in keyof T]: Question<T[P]>;
};

export interface InterviewOptions<S> {
  /** A ReadLine object for the interview. If not provided, stdio will be used. */
  rl?: readline.ReadLine;

  /** The stream to which output will be written. Defaults to stdout. */
  output?: NodeJS.WriteStream;

  /** A callback that will be called whenever a state change occurs. */
  onChange?: (state: S) => void;

  /** A function that returns the current date (useful for testing). */
  getDate?: () => Date;
}

/**
 * This represents a series of questions for a user, parameterized by
 * a type that represents the state of the interview (e.g., the answers
 * to the questions the user has been asked).
 * 
 * This class has been designed to conduct interviews using multiple
 * communication media (voice, SMS, web, etc), though at the time
 * of this writing, only a console-based readline interface is available.
 */
export abstract class Interview<S> {
  rl: readline.ReadLine;
  isAsking: boolean;
  output: NodeJS.WriteStream;
  onChange?: (state: S) => void;
  getDate: () => Date;

  constructor(options: InterviewOptions<S> = {}) {
    this.isAsking = false;
    this.output = options.output || process.stdout;
    this.rl = options.rl || readline.createInterface({
      input: process.stdin,
      output: this.output
    });
    this.onChange = options.onChange;
    this.getDate = options.getDate || (() => new Date());
  }

  /** This is just a promisified wrapper around ReadLine.question(). */
  private askRaw(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.rl.question(query, answer => {
        resolve(answer);
      });
    });
  }

  /** Ask a question of the user. */
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

  /**
   * Ask a number of questions of the user. Some user interfaces,
   * such as screens, may present the questions as a single form.
   */
  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    const result = {} as T;

    for (let key in questions) {
      result[key] = await this.ask(questions[key]);
    }

    return result;
  }

  /**
   * This is the core abstract method that subclasses must implement.
   * Given a current state, it must ask any required questions and
   * return a promise that represents the new state of the interview.
   * 
   * Note that the state is immutable, so the method should always
   * create a new state object--unless the interview is over, in
   * which case it should just return the unchanged state it was
   * passed in.
   * 
   * @param state The current state of the interview.
   */
  abstract async askNext(state: S): Promise<S>;

  /**
   * Notifies the user with important information.
   */
  notify(text: string) {
    this.output.write(`${text}\n`);
  }

  /**
   * Runs the interview, asking the user questions until they
   * are exhausted. Returns the final state of the interview.
   * 
   * @param initialState 
   */
  async execute(initialState: S): Promise<S> {
    let state = initialState;

    while (true) {
      const nextState = await this.askNext(state);
      if (nextState === state) {
        break;
      }
      state = nextState;
      if (this.onChange) {
        this.onChange(state);
      }
    }

    this.rl.close();

    return state;
  }
}
