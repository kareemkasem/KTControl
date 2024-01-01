import JOI from "joi";
import {AttendanceEntry} from "../types";

export const attendanceEntrySchema = JOI.object<AttendanceEntry>({
    employee: JOI.number().required(),
    day: JOI.string().required(),
    clockIn: JOI.date().required(),
    clockOut: JOI.date().optional()
})
