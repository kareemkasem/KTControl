import { MongoClient } from "mongodb";
import {
	Employee,
	IncentiveEntry,
	IncentiveEntryFormInput,
	IncentiveItem,
} from "./types";

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

const dbClient = client.db("ktcontrol");

export const db = {
	employees: dbClient.collection<Employee>("employees"),
	incentive: dbClient.collection<IncentiveEntry>("incentive"),
	incentiveItems: dbClient.collection<IncentiveItem>("incentive_items"),
} as const;
