/**
 * These are the core fields from the Twilio POST webhook body
 * that we care about.
 */
export interface SmsPostBody {
  From: string,               // e.g. '+14151234567'
  MediaUrl0?: string,         // e.g. 'https://api.twilio.com/2010-04-01/...'
  Body: string,               // e.g. 'hello'
}

/**
 * For reference, these are the other fields in the Twilio POST
 * webhook body that we don't currently use, but might use later.
 */
export interface FullSmsPostBody extends SmsPostBody {
  ToCountry: string,          // e.g. 'US'
  ToState: string,            // e.g. 'NY'
  SmsMessageSid: string,
  NumMedia: string,           // e.g. '0'
  ToCity: string,             // e.g. 'BROOKLYN'
  FromZip: string,            // e.g. '94107'
  SmsSid: string,
  FromState: string,          // e.g. 'CA'
  SmsStatus: string,          // e.g. 'received'
  FromCity: string,           // e.g. 'SAN FRANCISCO'
  FromCountry: string,        // e.g. 'US'
  To: string,                 // e.g. '+17181234567'
  ToZip: string,              // e.g. '11418'
  NumSegments: string,        // e.g. '1'
  MessageSid: string,
  AccountSid: string,
  ApiVersion: string,         // e.g. '2010-04-01'
}

export function isSmsPostBody(obj: any): obj is SmsPostBody {
  return (
    obj &&
    obj.From &&
    typeof(obj.From) === 'string' &&
    typeof(obj.Body) === 'string'
  );
}
