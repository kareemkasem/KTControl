import JOI from "joi";
import { AttendanceEntry } from "../types";

export const BonusSchema = JOI.object<AttendanceEntry>({
	employee: JOI.number().required(),
	date: JOI.date().required(),
	month: JOI.string()
		.regex(/(0[1-9]|1[0-2])-(19|20)\d{2}/)
		.required(),
	clockIn: JOI.string().required(),
	clockOut: JOI.string().required(),
});
