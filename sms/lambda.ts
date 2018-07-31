/**
 * This is an experimental AWS Lambda function to process incoming SMS
 * messages passed-in to the AWS API Gateway by Twilio.
 * 
 * It's expected that the Lambda function be configured for Node 8.x.
 * You may also need to set up an IAM Role (Execution Role) that allows
 * the function to talk to your DynamoDB table. And you'll also need to
 * configure API Gateway to trigger your Lambda function. Then you'll
 * have to copy its Invoke URL and paste it into Twilio's Messaging
 * webhook configuration.
 * 
 * This file will be bundled by webpack as lambda.bundle.js: that's the
 * file you'll need to copy-paste into the Lambda management console JS
 * editor (or upload via some other means). (Because it only uses aws-sdk
 * and built-in node modules, you won't need to package it in a ZIP file
 * or anything.)
 * 
 * The following environment variables are required:
 * 
 *   DYNAMODB_TABLE - Specifies the name of the AWS DynamoDB table to use
 *                    for storing user data.
 */
import * as querystring from 'querystring';

import { DynamoStorage } from "../lib/sms/storage-dynamodb";
import { SmsAppState, processMessage } from "./process-message";
import { isSmsPostBody } from '../lib/sms/post-body';

const { DYNAMODB_TABLE } = process.env;

type HttpHeader = 'Content-Type';
type HttpMethod = 'GET'|'POST';

type HttpHeaders = {
  [key in HttpHeader]: string;
};

// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
interface AWSGatewayResponse {
  statusCode: number;
  headers: HttpHeaders;
  body: string;
}

// https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
interface AWSGatewayRequest {
  path: string;
  httpMethod: HttpMethod;
  headers: HttpHeaders;
  body: string;
}

function badRequest(body: string): AWSGatewayResponse {
  return {
    statusCode: 400,
    headers: {
      'Content-Type': 'text/plain'
    },
    body
  };
}

export default async function handler(event: AWSGatewayRequest): Promise<AWSGatewayResponse> {
  if (!DYNAMODB_TABLE) throw new Error("DYNAMODB_TABLE environment var is missing");

  if (event.httpMethod !== 'POST') {
    return badRequest("Only POST is supported");
  }

  const storage = new DynamoStorage<SmsAppState>(DYNAMODB_TABLE, 'phoneNumber');

  const args = querystring.parse(event.body);

  if (!isSmsPostBody(args)) {
    return badRequest("POST args are invalid");
  }

  const twiml = await processMessage(args, storage);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    },
    body: twiml.toString()
  };
}
