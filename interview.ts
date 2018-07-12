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

type MultiChoiceAnswer<T> = [T, string];

export class MultiChoiceQuestion<T> extends Question<T> {
  question: string;
  answers: MultiChoiceAnswer<T>[];

  constructor(question: string, answers: MultiChoiceAnswer<T>[]) {
    super();
    this.question = question;
    this.answers = answers;
  }

  get text(): string {
    const parts = [this.question, ''];

    this.answers.forEach(([_, label], i) => {
      parts.push(`${i + 1} - ${label}`);
    });

    parts.push('', 'Enter a number from the list above:');

    return parts.join('\n');
  }

  processResponse(response: string): T|ValidationError {
    const responseInt = parseInt(response, 10);
    const answer = this.answers[responseInt - 1];

    if (answer === undefined) {
      return new ValidationError('Please choose a valid number.');
    }

    return answer[0];
  }
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

type QuestionsFor<T> = {
  [P in keyof T]: Question<T[P]>;
};

export interface InterviewOptions<S> {
  rl?: readline.ReadLine;
  output?: NodeJS.WriteStream;
  onChange?: (state: S) => void;
}

export abstract class Interview<S> {
  rl: readline.ReadLine;
  isAsking: boolean;
  output: NodeJS.WriteStream;
  onChange?: (state: S) => void;

  constructor(options: InterviewOptions<S> = {}) {
    this.isAsking = false;
    this.output = options.output || process.stdout;
    this.rl = options.rl || readline.createInterface({
      input: process.stdin,
      output: this.output
    });
    this.onChange = options.onChange;
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

  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    const result = {} as T;

    for (let key in questions) {
      result[key] = await this.ask(questions[key]);
    }

    return result;
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
      if (this.onChange) {
        this.onChange(state);
      }
    }

    this.rl.close();

    return state;
  }
}
