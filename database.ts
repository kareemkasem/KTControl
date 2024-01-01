import {MongoClient} from "mongodb";
import {AttendanceEntry, Bonus, DayOff, Employee, IncentiveEntry, IncentiveItem} from "./types";

if (!process.env.MONGO_URI) {
    throw new Error("mongo uri not defined");
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
    attendance: database.collection<AttendanceEntry>("attendance"),
    dayOff: database.collection<DayOff>("day_off")
} as const;
