import * as readline from 'readline';
import * as stream from 'stream';

import { InterviewIO, QuestionsFor } from '../interview-io';
import { Question, ValidationError } from '../question';
import { PhotoQuestion } from './photo';
import { Photo } from '../util';

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

    let text = question.text;

    // If the question ends with a period, make it end with a colon instead.
    const sentenceMatch = text.match(/^(.+)\.$/);
    if (sentenceMatch) {
      text = `${sentenceMatch[1]}:`;
    }

    this.isAsking = true;
    const rawAnswer = await this.askRaw(`${text} `);
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

  createPhotoQuestion(text: string): Question<Photo> {
    return new PhotoQuestion(text);
  }
}
