import { Request, Response } from "express";
import { db } from "../database";
import { WithId } from "mongodb";
import { AttendanceMonth, Employee } from "../types";

const CURRENT_MONTH_STRING =
	new Date().getMonth() + 1 + "/" + new Date().getFullYear();

const DAYS_IN_CURRENT_MONTH = new Date(
	new Date().getMonth() + 1,
	new Date().getFullYear()
).getUTCDate();

// GET /attendance
export function getMainPage(req: Request, res: Response) {
	res.status(200).render("Attendance/index.ejs");
}

// GET /generate-new
export async function getGenerateNewMonth(req: Request, res: Response) {
	let status = "none";
	const monthInDatabase = await db.attendance.findOne<WithId<AttendanceMonth>>({
		month: CURRENT_MONTH_STRING,
	});
	if (monthInDatabase) {
		status = monthInDatabase.status;
	}
	res.status(200).render("Attendance/generate-new-month.ejs", {
		currentMonthString: CURRENT_MONTH_STRING,
		status: status,
	});
}

// POST /generate-new
export async function generateNewMonth(req: Request, res: Response) {
	const employees = await db.employees.find<WithId<Employee>>({}).toArray();

	const newMonthDate: AttendanceMonth = {
		month: CURRENT_MONTH_STRING,
		status: "current",
		entries: employees.map((employee) => ({
			employee: employee.name,
			totalHours: 0,
			clockIn: employee.workHours.clockIn,
			clockOut: employee.workHours.clockOut,
			entries: new Array(DAYS_IN_CURRENT_MONTH).fill({
				clockIn: "pending",
				clockOut: "pending",
				total: 0,
			}),
		})),
	};

	await db.attendance.insertOne(newMonthDate);

	res.redirect("/attendance/current-month");
}

// GET /attendance/current-month
export async function getCurrentMonth(req: Request, res: Response) {
	const data = await db.attendance.findOne({ month: CURRENT_MONTH_STRING });
	console.log(data);
	res.status(200).render("Attendance/current-month.ejs", { data });
}
