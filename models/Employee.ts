import { COLLECTIONS } from "../database";
import JOI from "joi";
import { Employee, WorkHours } from "../types";

export const EmployeeSchema: JOI.Schema<Employee> = JOI.object({
	code: JOI.number().min(1).max(100).required(),
	name: JOI.string().max(20).required(),
	username: JOI.string()
		.lowercase()
		.min(3)
		.max(28)
		.regex(/^[a-zA-Z0-9_.]+$/)
		.required(),
	password: JOI.string().min(1).max(28).required(),
	title: JOI.string().lowercase().valid("pharmacist", "assistant", "trainee", "delivery", "manager", "other").required(),
	hourlyRate: JOI.number().min(100).max(5000).required(),
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
			const clockIn = clockInHrs + clockInMins / 60;
			const [clockOutHrs, clockOutMins] = workHours.clockOut.split(":").map((x) => parseInt(x));
			const clockOut = clockOutHrs + clockOutMins / 60;

			if (clockOut - clockIn >= 5 && clockOut - clockIn <= 12) return workHours;
			if (clockIn - clockOut >= 5 && clockIn - clockOut <= 12) return workHours; // next day case

			throw new Error("work hours can't be less than 5hrs or more than 12hrs");
		})
		.required(),
});

export const EmployeeColl = COLLECTIONS.employees;
