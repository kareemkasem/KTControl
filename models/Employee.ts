import { db } from "../database";
import JOI from "joi";
import { Employee, WorkHours } from "../types";

export const EmployeeSchema: JOI.Schema<Employee> = JOI.object({
	code: JOI.number().min(1).max(100).required(),
	name: JOI.string().max(20).required(),
	username: JOI.string().lowercase().min(3).max(20).required(),
	password: JOI.string().min(1).max(20).required(),
	title: JOI.string().lowercase().valid("pharmacist", "assistant", "trainee", "delivery", "manager", "other").required(),
	hourlyRate: JOI.number().min(100).max(2000).required(),
	workHours: JOI.object({
		clockIn: JOI.string()
			.regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
		clockOut: JOI.string()
			.regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
	})
		.custom((workHours: WorkHours) => {
			const [clockInHrs, clockInMins] = workHours.clockIn.split(":").map((x) => parseInt(x));
			const [clockOutHrs, clockOutMins] = workHours.clockOut.split(":").map((x) => parseInt(x));

			if (clockOutHrs > clockInHrs) return workHours;
			if (clockInHrs === clockOutHrs && clockOutMins > clockInMins) return workHours;

			throw new Error("work hours aren't correct");
		}, "Work Hours Validation")
		.required(),
});

export const EmployeeColl = db.collection<Employee>("employees");
