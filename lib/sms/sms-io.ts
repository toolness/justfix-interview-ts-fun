import { IOCancellationError } from "../interview-io";
import { TextIO } from "../console/readline-io";
import { Recorder } from "../recorder";
import SimpleTwimlResponse from './simple-twiml-response';

export type SmsIOAction = 'askQuestion';

/**
 * This is a class that attempts to (rather messily) adapt our control flow
 * for interview logic with the extremely asynchronous nature of SMS messaging.
 * 
 * The gist is that instead of actually asking a user for an answer to a
 * question and then returning that answer via Promise resolution, we
 * instead throw an exception, which lets the caller know that they need
 * to wait for the next incoming SMS message in order to answer the
 * question.
 */
export class SmsIO implements TextIO {
  private text: string|null;

  constructor(private readonly twiml: SimpleTwimlResponse, readonly recorder: Recorder<SmsIOAction>, text: string|null) {
    this.text = text;
  }

  async writeLine(text: string): Promise<void> {
    this.twiml.message(text);
  }

  async question(query: string): Promise<string> {
    // We'll be called in at least two different states: once the very
    // first time our question is asked, in which case we want to
    // message the question to the user, and again when the user
    // has replied to our question, in which case we *don't* want
    // to message the question to the user (lest we say the same
    // thing twice) but instead want to process the answer they've
    // provided.
    this.recorder.playbackOrRecord('askQuestion', async () => {
      this.twiml.message(query);
      return null;
    });
    const text = this.text;
    if (text !== null) {
      this.text = null;
      return text;
    }
    throw new SmsIsAwaitingAnswerError(this);
  }

  close(): void {
  }
}

/**
 * This is the exception callers should catch, which indicates
 * that a question has been asked, and the caller should now wait
 * for the user to send an SMS in response.
 */
export class SmsIsAwaitingAnswerError extends IOCancellationError {
}
