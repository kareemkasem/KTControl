import JOI from "joi";
import {attendanceEntry} from "../types";

export const attendanceEntrySchema = JOI.object<attendanceEntry>({
    employee: JOI.number().required(),
    day: JOI.date().required(),
    clockIn: JOI.date().required(),
    clockOut: JOI.date().optional()
})
