import { MongoClient } from "mongodb";
import {Employee, IncentiveEntry, IncentiveItem} from "./types";

if (!process.env.MONGO_URI) {
	throw new Error("mongo uri not defined");
}

const client = new MongoClient(process.env.MONGO_URI);

export async function connectToDatabase() {
	try {
		await client.connect();
	} catch (e) {
		console.log(e);
	}
}

const db = client.db("ktcontrol");

export const COLLECTIONS = {
	employees: db.collection<Employee>("employees"),
	incentive: db.collection<IncentiveEntry>("incentive"),
	incentiveItems: db.collection<IncentiveItem>("incentive_items")
} as const;
