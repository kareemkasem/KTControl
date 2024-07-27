import JOI from "joi";
import {
	AttendanceEntry,
	AttendanceMonth,
	SingleAttendanceEntry,
} from "../types";

export const attendanceEntrySchema = JOI.object<AttendanceMonth>({
	month: JOI.string()
		.required()
		.regex(/(0[1-9]|1[0-2])-(19|20)\d{2}/),
	entries: JOI.array()
		.items(
			JOI.object<AttendanceEntry>({
				employee: JOI.number().min(1).max(10000).required(),
				clockIn: JOI.string().required,
				clockOut: JOI.string().required,
				totalHours: JOI.number().default(0),
				entries: JOI.array().items(
					JOI.object<SingleAttendanceEntry>({
						clockIn: JOI.date().allow("pending").default("pending"),
						clockOut: JOI.date().allow("pending").default("pending"),
					})
				),
			})
		)
		.required(),
	status: JOI.string().lowercase().valid("current", "complete").required(),
});
