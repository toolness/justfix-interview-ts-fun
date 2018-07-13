import { Question, ValidationError } from './question';
import { InterviewIO } from './interview-io';

export interface InterviewOptions<S> {
  /** The input/output used to communicate with the user. */
  io: InterviewIO;

  /** A callback that will be called whenever a state change occurs. */
  onChange?: (state: S) => void;

  /** A function that returns the current date (useful for testing). */
  getDate?: () => Date;
}

/**
 * This represents a series of questions for a user, parameterized by
 * a type that represents the state of the interview (e.g., the answers
 * to the questions the user has been asked).
 */
export abstract class Interview<S> {
  private onChange?: (state: S) => void;
  readonly getDate: () => Date;
  readonly io: InterviewIO;

  constructor(options: InterviewOptions<S>) {
    this.onChange = options.onChange;
    this.getDate = options.getDate || (() => new Date());
    this.io = options.io;
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

    return state;
  }
}
