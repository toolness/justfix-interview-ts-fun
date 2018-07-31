import AWS from 'aws-sdk';
import { Storage } from './storage';

export class DynamoStorage<S> implements Storage<S> {
  readonly docClient: AWS.DynamoDB.DocumentClient;

  constructor(readonly tableName: string, readonly primaryKey: keyof S) {
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  async set(key: string, value: S): Promise<void> {
    const req = this.docClient.put({
      TableName: this.tableName,
      Item: value
    });
    await req.promise();
  }

  async get(key: string): Promise<S|null> {
    const req = this.docClient.get({
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: key
      }
    });
    const res = await req.promise();
    return res.Item ? res.Item as S : null;
  }

  async close(): Promise<void> {
  }
}
