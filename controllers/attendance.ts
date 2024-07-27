import { Request, Response } from "express";
import { db } from "../database";
import { WithId } from "mongodb";
import { AttendanceMonth } from "../types";

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
	res.status(200).render("Attendance/generateNewMonth.ejs", {
		currentMonthString: currentMonthString,
		status: status,
	});
}
