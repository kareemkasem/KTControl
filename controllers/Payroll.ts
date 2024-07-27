import { Request, Response } from "express";
import { db } from "../database";
import workHoursDiff from "../utils/workHoursDiff";
import { parseMonth } from "../utils/date-parser";
import { Bonus, IncentiveEntryForPayroll, SalaryCalculations } from "../types";

const MONTHLY_OFF_DAYS = 4; // to be overridden via admin configuration
const UNAUTHORIZED_ABSENCE_PENALTY = 1; // to be overridden via admin configuration

// GET /payroll/salary/:id
export async function calculateSalary(
	req: Request<{ id: string }>,
	res: Response
) {
	try {
		const employee = await db.employees.findOne({ code: +req.params.id });
		if (!employee) {
			res.status(404).send({ error: "Employee not found" });
			return;
		}

		const today = new Date();
		const month = "12-2023"; //!parseMonth();
		const daysInThisMonth = 31;
		//! new Date(today.getFullYear(),today.getMonth(),0).getDate();

		// * salary details variables
		let mainSalary: number;
		let unauthorizedAbsence: number;
		let bonuses: number;
		let deductions: number;
		let incentive: number;
		let totalHours: number;

		let bonusList: Bonus[];
		let deductionList: Bonus[];
		let incentiveList: IncentiveEntryForPayroll[];

		//* Calculate total work hours
		const workHoursQueryResult = await db.attendance
			.aggregate<{ total: number }>([
				{
					$match: {
						employee: employee.code,
						//! attach month
					},
				},
				{
					$project: {
						total: {
							$divide: [
								{
									$subtract: ["$clockOut", "$clockIn"],
								},
								3600000,
							],
						},
					},
				},
			])
			.toArray();

		totalHours = +workHoursQueryResult[0].total.toFixed(2);

		// * Calculating main salary
		const workDaysCount = await db.attendance.countDocuments({
			employee: employee.code,
			//! attach month
		});
		const workHours = workHoursDiff(
			employee.workHours.clockIn,
			employee.workHours.clockOut,
			"hours"
		);
		const hourlyRate = employee.hourlyRate;
		mainSalary =
			(workDaysCount * workHours * hourlyRate) /
			(daysInThisMonth - MONTHLY_OFF_DAYS);

		// * Calculating Bonuses
		bonusList = await db.bonuses
			.find({ code: employee.code, month, type: "bonus" })
			.toArray();
		bonuses = bonusList.reduce((acc, curr) => acc + curr.amount, 0);
		deductionList = await db.bonuses
			.find({ code: employee.code, month, type: "deduction" })
			.toArray();
		deductions = deductionList.reduce((acc, curr) => acc - curr.amount, 0); // it's stored in negative values

		// * Calculating Incentive
		incentiveList = await db.incentive
			.aggregate<IncentiveEntryForPayroll>([
				{
					$match: {
						employee: employee.code,
						month,
					},
				},
				{
					$unwind: "$details",
				},
				{
					$lookup: {
						from: "incentive_items",
						localField: "details.item",
						foreignField: "_id",
						as: "details.item",
					},
				},
				{
					$project: {
						details: {
							$first: "$details.item",
						},
						quantity: "$details.quantity",
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: [
								{
									_id: "$_id",
									quantity: "$quantity",
								},
								"$details",
							],
						},
					},
				},
			])
			.toArray();

		incentive = incentiveList.reduce(
			(acc, curr) => acc + curr.quantity * curr.incentive,
			0
		);

		// * Creating Salary Object
		const salary: SalaryCalculations = {
			individualCalculations: {
				mainSalary,
				bonuses,
				deductions,
				incentive,
			},
			total: Math.round(mainSalary + bonuses - deductions + incentive),
			details: {
				totalHours,
				workDaysCount,
				bonusList,
				deductionList,
				incentiveList,
			},
		};

		res.status(200).send(salary);
	} catch (error) {
		res.status(500).send({ error: (error as Error).message });
	}
}
