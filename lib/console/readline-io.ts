import * as readline from 'readline';

import { InterviewIO, QuestionsFor } from '../interview-io';
import { Question, ValidationError } from '../question';
import { PhotoQuestion } from './photo';
import { Photo } from '../util';
import { EventEmitter } from 'events';

const NOTIFY_DELAY_MS = 3000;

/**
 * This represents a primarily text-based IO system.
 */
interface TextIO {
  writeLine(text: string): Promise<void>;
  question(query: string): Promise<string>;
  close(): void;
}

/** Standard text i/o that uses readline/stdout. */
export class ConsoleIO extends EventEmitter implements TextIO {
  private readonly outputStream: NodeJS.WriteStream;
  private readonly rl: readline.ReadLine;

  /**
   * @param rl A ReadLine object for the interview. If not provided, stdio will be used.
   * @param output The stream to which output will be written. Defaults to stdout.
   */
  constructor(rl?: readline.ReadLine, outputStream?: NodeJS.WriteStream) {
    super();
    this.outputStream = outputStream || process.stdout;
    this.rl = rl || readline.createInterface({
      input: process.stdin,
      output: this.outputStream
    });
  }

  async writeLine(text: string) {
    this.outputStream.write(`${text}\n`);
  }

  question(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.rl.question(query, answer => {
        resolve(answer);
      });
    });
  }

  /** Close the underlying ReadLine object. */
  close() {
    this.rl.close();
  }
}

/** Standard interview i/o that uses primarily text. */
export class TextInterviewIO extends InterviewIO {
  private isAsking: boolean = false;

  constructor(private readonly textIO: TextIO = new ConsoleIO()) {
    super();
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
    const rawAnswer = await this.textIO.question(`${text} `);
    const result = await question.processResponse(rawAnswer);
    this.isAsking = false;

    if (result instanceof ValidationError) {
      await this.textIO.writeLine(result.message);
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

  async notify(text: string) {
    await this.textIO.writeLine(`\n${text}\n`);
    await this.sleep(NOTIFY_DELAY_MS);
  }

  async setStatus(text: string) {
    await this.textIO.writeLine(text);
  }

  close() {
    this.textIO.close();
  }

  createPhotoQuestion(text: string): Question<Photo> {
    return new PhotoQuestion(text);
  }
}
