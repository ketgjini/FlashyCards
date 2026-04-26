import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

let client: MongoClient;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getClientPromise(): Promise<MongoClient> {
  const safeUri = uri;

  if (!global._mongoClientPromise) {
    client = new MongoClient(safeUri);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}