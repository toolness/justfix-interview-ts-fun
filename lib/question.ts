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
  /**
   * The human-readable text explaining the error. It will
   * be shown to the user.
   */
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
  abstract processResponse(response: string): Promise<T|ValidationError>;
}

/**
 * Represents a valid answer to a multiple-choice question.
 * The first member represents the actual data value, while
 * the second represnts the human-readable text for it.
 */
type MultiChoiceAnswer<T> = [T, string];

/**
 * A multiple-choice question. Answers are automatically
 * numbered.
 */
export class MultiChoiceQuestion<T> extends Question<T> {
  /** The question, e.g. "What kind of lease do you have?". */
  question: string;

  /** Potential answers to the question, which the user must choose from. */
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

  async processResponse(response: string): Promise<T|ValidationError> {
    const responseInt = parseInt(response, 10);
    const answer = this.answers[responseInt - 1];

    if (answer === undefined) {
      return new ValidationError('Please choose a valid number.');
    }

    return answer[0];
  }
}

/**
 * A basic question that accepts any kind of non-blank input.
 */
export class NonBlankQuestion extends Question<string> {
  /** The text of the question, e.g. "What is your name?". */
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  async processResponse(response: string): Promise<string|ValidationError> {
    if (!response.trim()) {
      return new ValidationError('Your response cannot be blank!');
    }
    return response;
  }
}

/**
 * A question whose answer must always be "yes" or "no".
 */
export class YesNoQuestion extends Question<boolean> {
  /** The text of the question, e.g. "Are you ok?". */
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  async processResponse(response: string): Promise<boolean|ValidationError> {
    const YES_REGEX = /^\s*y/i;
    const NO_REGEX = /^\s*n/i;

    if (YES_REGEX.test(response)) {
      return true;
    } else if (NO_REGEX.test(response)) {
      return false;
    }
    return new ValidationError('Please answer with "yes" or "no".');
  }
}

/**
 * A question that asks for a date (not including the time).
 */
export class DateQuestion extends Question<Date> {
  /** The text of the question, e.g. "When did you receive the letter?". */
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  async processResponse(response: string): Promise<Date|ValidationError> {
    const DATE_REGEX = /^\d\d\d\d-\d\d-\d\d$/;
    if (DATE_REGEX.test(response)) {
      const date = new Date(response);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new ValidationError('Please specify a valid date in YYYY-MM-DD format.');
  }
}
