import { MongoClient } from "mongodb";
import {Employee} from "./types";

if (!process.env.MONGO_URI) {
	throw new Error("mongo uri not defined");
}

const client = new MongoClient(process.env.MONGO_URI);

export const db = client.db("ktcontrol");

export async function connectToDatabase() {
	try {
		await client.connect();
	} catch (e) {
		console.log(e);
	}
}

export const COLLECTIONS = {
	employees: db.collection<Employee>("employees")
} as const