import { MongoClient } from "mongodb"

// if (!process.env.MONGO_URI) {
//   throw new Error("mongo uri not defined")
// }

console.log(process.env.MONGO_URI)

const client = new MongoClient(process.env.MONGO_URI!)

export const db = client.db("ktconnect")

export async function connectToDatabase() {
  try {
    await client.connect()
  } catch (e) {
    console.log(e)
  }
}
