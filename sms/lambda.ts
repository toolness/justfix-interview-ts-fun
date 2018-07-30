import { TwimlResponse } from 'twilio';

export default function handler(context: any, event: any, callback: (err: Error|null, response?: TwimlResponse) => void): void {
  const twiml = new TwimlResponse();
  twiml.message('hallooooooo!');
  callback(null, twiml);
}
