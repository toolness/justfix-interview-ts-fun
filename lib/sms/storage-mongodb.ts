import { MongoClient, Db, Collection } from 'mongodb';
import { Storage } from './storage';

export class MongoStorage<S> implements Storage<S> {
  clientPromise: Promise<MongoClient>;
  dbPromise: Promise<Db>;
  collectionPromise: Promise<Collection<S>>;

  constructor(readonly url: string, readonly collectionName: string, readonly primaryKey: keyof S) {
    this.clientPromise = MongoClient.connect(this.url, {
      useNewUrlParser: true
    });
    this.dbPromise = this.clientPromise.then(client => client.db());
    this.collectionPromise = this.dbPromise.then(async db => {
      const collection = await db.collection(this.collectionName);

      await collection.createIndex({ [this.primaryKey]: 1 });

      return collection;
    });
  }

  async set(key: string, value: S): Promise<void> {
    const collection = await this.collectionPromise;

    await collection.update({ [this.primaryKey]: key }, value, {
      upsert: true
    });
  }

  async get(key: string): Promise<S|null> {
    const collection = await this.collectionPromise;

    return collection.findOne({ [this.primaryKey]: key });
  }

  async close(): Promise<void> {
    return (await this.clientPromise).close();
  }
}
