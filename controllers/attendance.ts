import { Request, Response } from "express";
// import {
// 	AttendanceEntry,
// 	AttendanceEntryFormInput,
// 	DayOffFormInput,
// 	Employee,
// } from "../types";
// import { db } from "../database";
// import bcrypt from "bcryptjs";
// import workHoursDiff from "../utils/workHoursDiff";
// import { parseDate, parseMonth, parseTime } from "../utils/date-parser";
// import { DayOffSchema } from "../models/dayOff";

// const MONTHLY_OFF_DAYS = 4; // to be overridden via admin configuration
// const MAX_TIME_DIFFERENCE = 120; // to be overridden via admin configuration
// const EMPLOYEE_DELAY_LIMIT = 30; // to be overridden via admin configuration
// const DELAY_DEDUCTION_FACTOR = 2; // to be overridden via admin configuration
// const EMPLOYEE_OVERTIME_MINIMUM = 15; // to be overridden via admin configuration
// const OVERTIME_BONUS_FACTOR = 1.5; // to be overridden via admin configuration
// const state: { error: string | null; submissionTrials: number } = {
// 	error: null,
// 	submissionTrials: 0,
// };

// // NOTE TO SELF: this implementation works (hopefully) but it's not something I'm proud of. please improve it

// // function calculateDeductionOrBonusPerMinute(minutes: number, employeeHourlyRate: number, type: "delay" | "overtime"): number {
// //     const today = new Date()
// //     const daysInThisMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
// //     const minutesWorthPerMonth = employeeHourlyRate / (daysInThisMonth - MONTHLY_OFF_DAYS) / 60

// //     let calculationFactor;
// //     if (type === "delay") {
// //         calculationFactor = DELAY_DEDUCTION_FACTOR * -1
// //     } else if (type === "overtime") {
// //         calculationFactor = OVERTIME_BONUS_FACTOR
// //     } else {
// //         throw new Error("type of operation in calculateDeductionOrBonusPerMinute isn't correct")
// //     }

// //     return Math.round(Math.abs(minutes) * minutesWorthPerMonth * calculationFactor)
// // }

// // function checkIfTimeDifferenceExceedLimit(timeDifference: number, name: string): boolean {
// //     if (state.submissionTrials === 0) {
// //         if (Math.abs(timeDifference) >= MAX_TIME_DIFFERENCE) {
// //             state.error = `WARNING: the timestamp submitted for employee ${name} has a ${timeDifference} minutes difference from the nearest entry. submit again if you're sure the code is correct. please note that overtime has to be approved by your admin.`
// //             state.submissionTrials++
// //             return true
// //         } else {
// //             return false
// //         }
// //     } else {
// //         return false
// //     }
// // }

// GET /attendance
export function getMainPage(req: Request, res: Response) {
	res.status(200).render("Attendance/index.ejs");
}

// // GET /attendance/employees
// export function getEmployeesPage(req: Request, res: Response) {
// 	res.status(200).render("Attendance/employees.ejs", { error: state.error });
// 	state.error = null;
// }

// // POST /attendance/employees
// export async function postEmployeeClockIn(
// 	req: Request<{}, {}, AttendanceEntryFormInput>,
// 	res: Response
// ) {
// 	// const employeeCode = parseInt(req.body.employee)
// 	// const password = req.body.password
// 	// const timeStamp = new Date()
// 	// const today = new Date().toDateString()
// 	// const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000)).toDateString()
// 	// let employee: Employee | null = null;
// 	// // password submission check
// 	// if (!password) {
// 	//     state.error = "please enter your password"
// 	//     res.status(404).redirect("/attendance/employees")
// 	//     return
// 	// }
// 	// // authentication
// 	// try {
// 	//     employee = await db.employees.findOne({code: employeeCode})
// 	//     if (!employee) {
// 	//         state.error = `No employee with code ${employeeCode} was found.`
// 	//         res.status(404).redirect("/attendance/employees")
// 	//         return
// 	//     }
// 	//     const authenticationResult = await bcrypt.compare(password, employee.password)
// 	//     if (!authenticationResult) {
// 	//         state.error = "wrong password"
// 	//         res.status(400).redirect("/attendance/employees")
// 	//         return
// 	//     }
// 	// } catch (error) {
// 	//     res.status(500).send({error: (error as Error).message})
// 	//     return;
// 	// }
// 	// // timestamp submission
// 	// try {
// 	//     const timeDifference = {
// 	//         clockIn: workHoursDiff(employee.workHours.clockIn),
// 	//         clockOut: workHoursDiff(employee.workHours.clockOut)
// 	//     }
// 	//     const existingEntryForToday = await db.attendance.findOne<AttendanceEntry>({employee: employeeCode, day: today})
// 	//     if (!existingEntryForToday) {
// 	//         // check for overnight shifts
// 	//         const existingEntryForYesterday = await db.attendance.findOne<AttendanceEntry>({
// 	//             employee: employeeCode,
// 	//             day: yesterday
// 	//         })
// 	//         if (existingEntryForYesterday && !existingEntryForYesterday.clockOut) {
// 	//             // * CASE 4: overnight for employee whose shift isn't overnight and spent an overnight
// 	//             if (workHoursDiff(employee.workHours.clockIn, employee.workHours.clockOut) > 0) {
// 	//                 if (checkIfTimeDifferenceExceedLimit(timeDifference.clockOut + 24 * 60, employee.name)) {
// 	//                     res.status(400).redirect("/attendance/employees")
// 	//                     return;
// 	//                 }
// 	//                 await db.bonuses.insertOne({
// 	//                     employee: employee.name,
// 	//                     code: employee.code,
// 	//                     type: "bonus",
// 	//                     amount: calculateDeductionOrBonusPerMinute(timeDifference.clockOut + 24 * 60, employee.hourlyRate, "overtime"),
// 	//                     comment: `spent ${timeDifference.clockOut + (24 * 60)} minutes in overtime in ${today}`,
// 	//                     month: parseMonth(),
// 	//                     approved: false
// 	//                 })
// 	//             } else {
// 	//                 // * CASE 3: overnight shift, clock out in yesterday's entry
// 	//                 if (checkIfTimeDifferenceExceedLimit(timeDifference.clockOut, employee.name)) {
// 	//                     res.status(400).redirect("/attendance/employees")
// 	//                     return;
// 	//                 }
// 	//                 // Overnight, case: employee left earlier than they should and gets a deduction
// 	//                 if (timeDifference.clockOut <= 0 && Math.abs(timeDifference.clockOut) >= EMPLOYEE_DELAY_LIMIT) {
// 	//                     await db.bonuses.insertOne({
// 	//                         employee: employee.name,
// 	//                         code: employee.code,
// 	//                         type: "deduction",
// 	//                         amount: calculateDeductionOrBonusPerMinute(timeDifference.clockOut, employee.hourlyRate, "delay"),
// 	//                         comment: `left earlier by ${timeDifference.clockOut * -1} minutes in ${today}`,
// 	//                         month: parseMonth(),
// 	//                         approved: true
// 	//                     })
// 	//                 }
// 	//                 // Overnight, case: employee did overtime and a bonus is automatically submitted awaiting approval
// 	//                 if (timeDifference.clockOut >= 0 && timeDifference.clockOut >= EMPLOYEE_OVERTIME_MINIMUM) {
// 	//                     await db.bonuses.insertOne({
// 	//                         employee: employee.name,
// 	//                         code: employee.code,
// 	//                         type: "bonus",
// 	//                         amount: calculateDeductionOrBonusPerMinute(timeDifference.clockOut, employee.hourlyRate, "overtime"),
// 	//                         comment: `spent ${timeDifference.clockOut} minutes in overtime in ${today}`,
// 	//                         month: parseMonth(),
// 	//                         approved: false
// 	//                     })
// 	//                 }
// 	//             }
// 	//             await db.attendance.updateOne({employee: employeeCode, day: yesterday}, {$set: {clockOut: timeStamp}})
// 	//         } else {
// 	//             // * CASE 1: Normal clockIn for the day (no overnight)
// 	//             if (checkIfTimeDifferenceExceedLimit(timeDifference.clockIn, employee.name)) {
// 	//                 res.status(400).redirect("/attendance/employees")
// 	//                 return
// 	//             }
// 	//             // Normal clockIn, Employee is late and gets a deduction
// 	//             if (timeDifference.clockIn >= 0 && timeDifference.clockIn >= EMPLOYEE_DELAY_LIMIT) {
// 	//                 await db.bonuses.insertOne({
// 	//                     employee: employee.name,
// 	//                     code: employee.code,
// 	//                     type: "deduction",
// 	//                     amount: calculateDeductionOrBonusPerMinute(timeDifference.clockIn, employee.hourlyRate, "delay"),
// 	//                     comment: `late by ${timeDifference.clockIn} minutes in ${today}`,
// 	//                     month: parseMonth(),
// 	//                     approved: true
// 	//                 })
// 	//             }
// 	//             // Normal clockIn, Employee came early and an overtime bonus is automatically submitted awaiting
// 	//             // approval
// 	//             if (timeDifference.clockIn <= 0 && Math.abs(timeDifference.clockIn) >= EMPLOYEE_OVERTIME_MINIMUM) {
// 	//                 await db.bonuses.insertOne({
// 	//                     employee: employee.name,
// 	//                     code: employee.code,
// 	//                     type: "bonus",
// 	//                     amount: calculateDeductionOrBonusPerMinute(timeDifference.clockIn, employee.hourlyRate, "overtime"),
// 	//                     comment: `spent ${timeDifference.clockIn * -1} minutes in overtime in ${today}`,
// 	//                     month: parseMonth(),
// 	//                     approved: false
// 	//                 })
// 	//             }
// 	//             await db.attendance.insertOne({employee: employeeCode, day: today, clockIn: timeStamp})
// 	//         }
// 	//     } else {
// 	//         if (existingEntryForToday.clockOut) {
// 	//             // * CASE 5: resubmission of today's entry
// 	//             state.error = `WARNING: Employee ${employee.name} has already registered clockIn and clockOut today. if you're sure about this operation please contact the system administrator to register your overtime manually`
// 	//             res.status(400).redirect("/attendance/employees")
// 	//             return
// 	//         } else {
// 	//             // * CASE 2: Normal clockOut for the day (no overnight)
// 	//             if (checkIfTimeDifferenceExceedLimit(timeDifference.clockOut, employee.name)) {
// 	//                 res.status(400).redirect("/attendance/employees")
// 	//                 return
// 	//             }
// 	//             // Normal clockOut, employee left earlier and gets a deduction
// 	//             if (timeDifference.clockOut <= 0 && Math.abs(timeDifference.clockOut) >= EMPLOYEE_DELAY_LIMIT) {
// 	//                 await db.bonuses.insertOne({
// 	//                     employee: employee.name,
// 	//                     code: employee.code,
// 	//                     type: "deduction",
// 	//                     amount: calculateDeductionOrBonusPerMinute(timeDifference.clockOut, employee.hourlyRate, "delay"),
// 	//                     comment: `left earlier by ${timeDifference.clockOut} minutes in ${today}`,
// 	//                     month: parseMonth(),
// 	//                     approved: true
// 	//                 })
// 	//             }
// 	//             // Normal clockOut, employee did overtime and a bonus is automatically submitted awaiting approval
// 	//             if (timeDifference.clockOut >= 0 && timeDifference.clockOut >= EMPLOYEE_OVERTIME_MINIMUM) {
// 	//                 await db.bonuses.insertOne({
// 	//                     employee: employee.name,
// 	//                     code: employee.code,
// 	//                     type: "bonus",
// 	//                     amount: calculateDeductionOrBonusPerMinute(timeDifference.clockOut, employee.hourlyRate, "overtime"),
// 	//                     comment: `spent ${timeDifference.clockOut} minutes in overtime in ${today}`,
// 	//                     month: parseMonth(),
// 	//                     approved: false
// 	//                 })
// 	//             }
// 	//             await db.attendance.updateOne({employee: employeeCode, day: today}, {$set: {clockOut: timeStamp}})
// 	//         }
// 	//     }
// 	// } catch (error) {
// 	//     res.status(500).send({error: (error as Error).message})
// 	//     return;
// 	// }
// 	// state.submissionTrials = 0
// 	// res.status(201).redirect("/attendance/employees")
// }

// export async function postEmployeeCLockOut() {}

// // GET /attendance/admin
// export function getAdminPage(req: Request, res: Response) {
// 	res.status(200).render("Attendance/admin.ejs");
// }

// // GET /attendance/overtime
// export async function getOvertimePage(req: Request, res: Response) {
// 	const data = await db.bonuses.find({ approved: false }).toArray();
// 	res.status(200).render("Attendance/overtime.ejs", { data });
// }

// // GET /attendance/history
// export async function getHistoryPage(
// 	req: Request<{}, {}, {}, { day?: string }>,
// 	res: Response
// ) {
// 	const day = req.query.day
// 		? new Date(req.query.day).toDateString()
// 		: new Date().toDateString();

// 	try {
// 		let data = await db.attendance
// 			.aggregate([
// 				{
// 					$match: { day },
// 				},
// 				{
// 					$lookup: {
// 						from: "employees",
// 						localField: "employee",
// 						foreignField: "code",
// 						as: "name",
// 					},
// 				},
// 				{
// 					$project: {
// 						_id: 1,
// 						clockIn: 1,
// 						clockOut: 1,
// 						name: {
// 							$first: "$name.name",
// 						},
// 						code: "$employee",
// 					},
// 				},
// 			])
// 			.toArray();

// 		data = data.map((entry) => {
// 			return {
// 				...entry,
// 				clockIn: parseTime(entry.clockIn),
// 				clockOut: parseTime(entry.clockOut),
// 			};
// 		});
// 		res
// 			.status(200)
// 			.render("Attendance/history", { data, day: parseDate(new Date(day)) });
// 	} catch (error) {
// 		res.status(500).send({ error: (error as Error).message });
// 	}
// }

// // GET /attendance/dayoff
// export async function getDayOffPage(req: Request, res: Response) {
// 	const employees = await db.employees
// 		.find({})
// 		.project({ name: 1, code: 1 })
// 		.toArray();
// 	const date = parseDate();
// 	res.status(200).render("Attendance/dayOff", { employees, date });
// }

// // POST /attendance/dayoff
// export async function postDayOff(
// 	req: Request<{}, {}, DayOffFormInput>,
// 	res: Response
// ) {
// 	const dayOffFormInput = {
// 		employee: +req.body.employee,
// 		date: new Date(req.body.date),
// 		comment: req.body.comment,
// 	};

// 	const { value, error } = DayOffSchema.validate(dayOffFormInput);

// 	if (error) {
// 		res.status(400).send({ error: error });
// 		return;
// 	}

// 	const dayOff = value;

// 	try {
// 		const employee = await db.employees.findOne({ code: dayOff.employee });
// 		if (!employee) {
// 			res.status(404).send({ error: "Employee not found" });
// 			return;
// 		}
// 		await db.dayOff.insertOne(dayOff);
// 		res.status(201).redirect("/attendance/dayoff");
// 	} catch (error) {
// 		res.status(500).send({ error: (error as Error).message });
// 	}
// }
