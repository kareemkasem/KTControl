import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {
	AttendanceEntry,
	AttendanceMonth,
	Bonus,
	Employee,
	IncentiveEntry,
	IncentiveItem,
} from "./types";

dotenv.config();

if (!process.env.MONGO_URI) {
	throw new Error("MongoURI isn't setup correctly");
}

const client = new MongoClient(process.env.MONGO_URI);

export async function connectToDatabase() {
	try {
		await client.connect();
	} catch (error) {
		console.log(error);
	}
}

const database = client.db("ktcontrol");

export const db = {
	employees: database.collection<Employee>("employees"),
	incentive: database.collection<IncentiveEntry>("incentive"),
	incentiveItems: database.collection<IncentiveItem>("incentive_items"),
	bonuses: database.collection<Bonus>("bonus"),
	attendance: database.collection<AttendanceMonth>("attendance"),
} as const;
