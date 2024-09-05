import { MongoClient, Db, } from "mongodb";

let db: any = null

if (!process.env.DATABASE_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export default async function connect() {
  if (db) {
    return { db }
  }

  const DATABASE_URI = process.env.DATABASE_URI as string

  const client: MongoClient = new MongoClient(DATABASE_URI, {
  })

  await client.connect()
  db = client.db(process.env.DB_LAR)

  return { db }

}