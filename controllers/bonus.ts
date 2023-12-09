import { Request, Response } from "express";
import { Bonus, BonusFormInput, Employee } from "../types";
import { BonusSchema } from "../models/Bonus";
import { db } from "../database";

export async function createBonus(
	req: Request<{}, {}, BonusFormInput>,
	res: Response
) {
	let bonus: Bonus = {
		...req.body,
		amount: +req.body.amount,
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
		res.status(201).redirect("/");
		return;
	} catch (error) {
		res.status(500).send({ error: (error as Error).message });
	}
}
