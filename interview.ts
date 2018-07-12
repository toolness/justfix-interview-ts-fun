import * as readline from 'readline';

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

  constructor(rl?: readline.ReadLine) {
    this.rl = rl || readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  ask<T>(question: Question<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.rl.question(`${question.text} `, answer => {
        const result = question.processResponse(answer);
        if (result instanceof ValidationError) {
          this.rl.write(result.message);
          return this.ask(question);
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
