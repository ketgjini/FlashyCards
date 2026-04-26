import { MongoClient } from "mongodb";

const rawUri = process.env.MONGODB_URI;

if (!rawUri) {
  throw new Error("MONGODB_URI is missing");
}

const uri: string = rawUri;

let client: MongoClient;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}