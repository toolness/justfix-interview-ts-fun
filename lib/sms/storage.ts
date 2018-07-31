import { FileSerializer } from '../console/serializer';

export interface Storage<S> {
  set(key: string, value: S): Promise<void>;
  get(key: string): Promise<S|null>;
  close(): Promise<void>;
}

interface FileStorageBlob<S> {
  [key: string]: S|undefined;
}

export class FileStorage<S> implements Storage<S> {
  private readonly serializer: FileSerializer<FileStorageBlob<S>>;

  constructor(readonly filename: string) {
    this.serializer = new FileSerializer(filename, {});
  }

  async set(key: string, value: S): Promise<void> {
    this.serializer.set({
      ...this.serializer.get(),
      [key]: value
    });
  }

  async get(key: string): Promise<S|null> {
    const result = this.serializer.get()[key];
    return result === undefined ? null : result;
  }

  async close(): Promise<void> {
  }
}
