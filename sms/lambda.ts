import AWS from 'aws-sdk';
import SimpleTwimlResponse from '../lib/sms/simple-twiml-response';

export default async function handler(event: any, context: any): Promise<any> {
  const twiml = new SimpleTwimlResponse();
  AWS.config.update({
    region: 'us-east-1',
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  const req = docClient.put({
    TableName: 'justfix-interview-fun',
    Item: {
      phoneNumber: 'boop',
      name: 'hi hi',
    }
  });
  await req.promise();

  return twiml.message('hallooooooo!');
}
