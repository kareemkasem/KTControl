import { Request, Response } from "express";
import { db } from "../database";
import { WithId } from "mongodb";
import { AttendanceMonth, Employee } from "../types";

// GET /attendance
export function getMainPage(req: Request, res: Response) {
	res.status(200).render("Attendance/index.ejs");
}

// GET /generate-new
export async function getGenerateNewMonth(req: Request, res: Response) {
	const currentMonthString =
		new Date().getMonth() + 1 + "/" + new Date().getFullYear();

	let status = "none";
	const monthInDatabase = await db.attendance.findOne<WithId<AttendanceMonth>>({
		month: currentMonthString,
	});
	if (monthInDatabase) {
		status = monthInDatabase.status;
	}
	res.status(200).render("Attendance/generate-new-month.ejs", {
		currentMonthString: currentMonthString,
		status: status,
	});
}

// POST /generate-new
export async function generateNewMonth(req: Request, res: Response) {
	const currentMonthString =
		new Date().getMonth() + 1 + "/" + new Date().getFullYear();
	const daysInCurrentMOnth = new Date(
		new Date().getMonth() + 1,
		new Date().getFullYear()
	).getUTCDate();

	const employees = await db.employees.find<WithId<Employee>>({}).toArray();

	const newMonthDate: AttendanceMonth = {
		month: currentMonthString,
		status: "current",
		entries: employees.map((employee) => ({
			employee: employee.code,
			totalHours: 0,
			clockIn: employee.workHours.clockIn,
			clockOut: employee.workHours.clockOut,
			entries: new Array(daysInCurrentMOnth).fill({
				clockIn: "pending",
				clockOut: "pending",
			}),
		})),
	};

	await db.attendance.insertOne(newMonthDate);

	// ! make it redirect to the newly created current month
	res.redirect("/attendance");
}
