import { MongoClient, Db, } from "mongodb";

let db = null

if (!process.env.DATABASE_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export default async function connect() {
  if (db) {
    return { db }
  }

  const DATABASE_URI = process.env.DATABASE_URI

  const client = new MongoClient(DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await client.connect()
  db = client.db(process.env.DB_LAR)

  return { db }

}