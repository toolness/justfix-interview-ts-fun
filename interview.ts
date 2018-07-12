import * as readline from 'readline';
import * as stream from 'stream';

export class ValidationError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export abstract class Question<T> {
  abstract get text(): string;

  abstract processResponse(response: string): T|ValidationError;
}

export class NonBlankQuestion extends Question<string> {
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  processResponse(response: string): string|ValidationError {
    if (!response.trim()) {
      return new ValidationError('Your response cannot be blank!');
    }
    return response;
  }
}

export abstract class Interview<S> {
  rl: readline.ReadLine;
  isAsking: boolean;
  output: NodeJS.WriteStream;

  constructor(rl?: readline.ReadLine, output: NodeJS.WriteStream = process.stdout) {
    this.isAsking = false;
    this.rl = rl || readline.createInterface({
      input: process.stdin,
      output: output
    });
    this.output = output;
  }

  ask<T>(question: Question<T>): Promise<T> {
    if (this.isAsking) {
      throw new Error('Assertion failure, we are already asking a question!');
    }

    return new Promise((resolve, reject) => {
      this.isAsking = true;
      this.rl.question(`${question.text} `, answer => {
        const result = question.processResponse(answer);
        this.isAsking = false;
        if (result instanceof ValidationError) {
          this.output.write(`${result.message}\n`);
          return this.ask(question).then(resolve).catch(reject);
        } else {
          return resolve(result);
        }
      });
    });
  }

  abstract async askNext(state: S): Promise<S>;

  async execute(initialState: S): Promise<S> {
    let state = initialState;

    while (true) {
      const nextState = await this.askNext(state);
      if (nextState === state) {
        break;
      }
      state = nextState;
    }

    this.rl.close();

    return state;
  }
}
