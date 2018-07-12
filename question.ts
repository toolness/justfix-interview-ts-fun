/** 
 * Represents a validation error for a question, e.g. when a user
 * provides an invalid response.
 * 
 * Note that this doesn't extend the standard Error class,
 * because it's not actually designed to be thrown: the rationale
 * is that validation errors are a normal occurrence and our
 * code should check for them all the time, rather than throwing
 * them and potentially having them go uncaught.
 */
export class ValidationError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

/**
 * Represents a question in an interview, parmeterized by
 * the type of data that a valid answer represents.
 * 
 * For example, a question like "How old are you?" might
 * be a Question<number>, while "Do you like salad?" might
 * be a Question<boolean>.
 */
export abstract class Question<T> {
  /** The text of the question, e.g. "How are you?". */
  abstract get text(): string;

  /**
   * Process a response entered by the user and return either
   * the data it represents, or an error explaining why the
   * response is invalid.
   * 
   * @param response A raw response entered by the user.
   */
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
