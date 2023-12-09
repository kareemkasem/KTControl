import { Request, Response } from "express";
import { Bonus, BonusFormInput, Employee } from "../types";
import { BonusSchema } from "../models/Bonus";
import { db } from "../database";
import { monthParser } from "../utils/date-parser";
import { ObjectId } from "mongodb";

// GET /bonuses
export async function getMainPage(req: Request, res: Response) {
	const currentMonth = monthParser();
	try {
		const data = await db.bonuses.find({ month: currentMonth }).toArray();
		res.status(200).render("Bonuses/index.ejs", { data });
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /bonuses/new
export async function getCreateBonusPage(req: Request, res: Response) {
	try {
		const { employees } = (
			await db.employees
				.aggregate<{ _id: ObjectId; employees: string[] }>([
					{ $match: {} },
					{ $project: { name: 1 } },
					{ $group: { _id: {}, employees: { $addToSet: "$name" } } },
				])
				.toArray()
		)[0];
		res.status(200).render("Bonuses/add.ejs", { employees });
	} catch (error) {
		res.send({ error: (error as Error).message });
	}
}

// POST /bonuses
export async function createBonus(
	req: Request<{}, {}, BonusFormInput>,
	res: Response
) {
	let bonus: Bonus = {
		...req.body,
		amount: +req.body.amount,
		month: monthParser(),
	};
	const { value, error } = BonusSchema.validate(bonus);
	if (error) {
		res.status(400).send({ error: error.message });
		return;
	}
	bonus = value;

	try {
		const employeeInDatabase = await db.employees.findOne<Employee>({
			name: bonus.employee,
		});
		if (!employeeInDatabase) {
			res.status(404).send({ error: "employee not found" });
			return;
		}
	} catch (error) {
		res.status(500).send({ error: (error as Error).message });
	}

	if (bonus.type === "deduction") bonus.amount = bonus.amount * -1;

	try {
		await db.bonuses.insertOne(bonus);
		res.status(201).redirect("/bonuses");
		return;
	} catch (error) {
		res.status(500).send({ error: (error as Error).message });
	}
}
