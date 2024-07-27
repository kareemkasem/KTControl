import JOI from "joi";
import { AttendanceEntry, AttendanceMonth } from "../types";

export const attendanceEntrySchema = JOI.object<AttendanceMonth>({
	month: JOI.string()
		.required()
		.regex(/(0[1-9]|1[0-2])-(19|20)\d{2}/),
	entries: JOI.array()
		.items(
			JOI.object<AttendanceEntry>({
				employee: JOI.number().min(1).max(10000).required(),
				day: JOI.string().required(),
				clockIn: JOI.date().allow("pending").default("pending"),
				clockOut: JOI.date().allow("pending").default("pending"),
				totalHours: JOI.number().default(0),
			})
		)
		.required(),
	status: JOI.string().lowercase().valid("current", "complete").required(),
});
