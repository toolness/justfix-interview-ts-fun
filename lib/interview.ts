import { EventEmitter } from 'events';

import { DateString } from './util';
import { InterviewIO } from './interview-io';

export interface InterviewOptions<S> {
  /** The input/output used to communicate with the user. */
  io: InterviewIO;

  /** The current date. */
  now?: Date;
}

export interface Command<S> {
  /**
   * Execute the command. This should already be bound to a
   * specific interview state by the code that created the command.
   */
  execute: () => Promise<S>;
}

/**
 * Properties common to any kind of to-do item.
 */
export interface BaseTodo {
  /** The short, succinct name of the to-do item. */
  name: string;

  /** A longer description of the to-do item. */
  description: string;
}

/**
 * An actionable to-do, i.e. an item that the user can
 * immediately take action on to move forward.
 */
export interface ActionableTodo<S> extends BaseTodo, Command<S> {
  status: 'available';
}

/**
 * A non-actionable to-do, i.e. an item that the user can
 * see but not actually do anything with.
 */
export interface UnactionableTodo extends BaseTodo {
  /** 
   * The status of the to-do can be one of the following:
   * 
   *   * blocked - The to-do can't move forward due to some
   *       action that is out of the user's immediate control.
   *   * complete - The to-do is already completed.
   *   * locked - The to-do can't yet be started because certain
   *       prerequisites haven't been met. However, the
   *       item should appear on the user's to-do list so they
   *       know what the future holds.
   */
  status: 'blocked'|'complete'|'locked';
}

/** A to-do item in an interview. */
export type Todo<S> = ActionableTodo<S> | UnactionableTodo;

/**
 * A scheduled follow-up portion of an interview, parameterized by
 * the state of the interview. For example, if the
 * interview asks the user to do something in the next week, it
 * might schedule a follow-up for a week later to ask the user
 * if they've done it yet.
 */
export interface FollowUp<S> extends Command<S> {
  /** The scheduled date of the follow-up. */
  date: DateString;

  /** 
   * The name of the follow-up.
   */
  name: string;
}

/**
 * This represents a series of questions for a user, parameterized by
 * a type that represents the state of the interview (e.g., the answers
 * to the questions the user has been asked).
 */
export abstract class Interview<S> extends EventEmitter {
  readonly now: Date;
  readonly io: InterviewIO;

  constructor(options: InterviewOptions<S>) {
    super();
    this.now = options.now || new Date();
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
   * This is an optional method that runs the next irreversible task that
   * the interview is capable of undertaking (e.g. sending an email or
   * real-world letter, filing a court case, etc).
   *
   * @param state The current state of the interview.
   */
  async runNextTask(state: S): Promise<S> {
    return state;
  }

  /**
   * This is an optional method that returns all the follow-ups
   * for the interview, given its current state.
   * 
   * @param state The current state of the interview.
   */
  getFollowUps(state: S): FollowUp<S>[] {
    return [];
  }

  /**
   * Return all follow-ups that strictly occur in the future (i.e.,
   * are not about to be followed-up now).
   * 
   * @param state The current state of the interview.
   */
  getFutureFollowUps(state: S): FollowUp<S>[] {
    return this.getFollowUps(state).filter(followUp => {
      return this.now < new Date(followUp.date);
    });
  }

  /**
   * This is an optional method that returns all of the to-do
   * items for the interview, given its current state.
   * 
   * @param state The current state of the interview.
   */
  getTodos(state: S): Todo<S>[] {
    return [];
  }

  /**
   * Execute the next valid follow-up, if any. If no valid
   * follow-ups are available, the original state is returned.
   * 
   * @param state The current state of the interview.
   */
  private async executeNextFollowUp(state: S): Promise<S> {
    for (let followUp of this.getFollowUps(state)) {
      if (this.now >= new Date(followUp.date)) {
        return await followUp.execute();
      }
    }
    return state;
  }

  /**
   * Runs the interview, asking the user questions until they
   * are exhausted. Returns the final state of the interview.
   * 
   * @param initialState 
   */
  async execute(initialState: S, command?: Command<S>): Promise<S> {
    let state = initialState;

    while (true) {
      let nextState = state;
      if (command) {
        nextState = await command.execute();
        command = undefined;
      } else {
        nextState = await this.askNext(state);
      }
      if (nextState === state) {
        nextState = await this.executeNextFollowUp(state);
      }
      if (nextState === state) {
        nextState = await this.runNextTask(state);
      }
      if (nextState === state) {
        break;
      }
      this.emit('change', state, nextState);
      state = nextState;
    }

    return state;
  }
}

export interface Interview<S> {
  emit(event: 'change', prevState: S, nextState: S): boolean;
  on(event: 'change', listener: (prevState: S, nextState: S) => void): this;
}
