import { Request, Response } from "express";
import { COLLECTIONS } from "../database";
import { IncentiveEntry } from "../types";
import { IncentiveEntrySchema } from "../models/IncentiveEntry";
import { ObjectId } from "mongodb";

// GET /incentive/month/:month
export async function getIncentivePerMonth(
	req: Request<{ month: string }>,
	res: Response
) {
	const month = req.params.month;

	try {
		const queryResult = (
			await COLLECTIONS.incentive
				.aggregate([
					{
						match: { month },
					},
					{
						$lookup: {
							from: "employees",
							localField: "employee",
							foreignField: "code",
							as: "employee",
						},
					},
					{ $unwind: "$employee" },
					{
						$project: {
							_id: 1,
							details: 1,
							"employee._id": 1,
							"employee.title": 1,
							"employee.name": 1,
							"employee.code": 1,
						},
					},
				])
				.toArray()
		)[0];
		res.status(200).send(queryResult);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/employee/:code
export async function getIncentivePerEmployee(
	req: Request<{ code: string }>,
	res: Response
) {
	const code = parseInt(req.params.code);

	try {
		const queryResult = (
			await COLLECTIONS.incentive
				.aggregate([
					{
						$facet: {
							employee: [
								{ $match: { employee: code } },
								{
									$lookup: {
										from: "employees",
										localField: "employee",
										foreignField: "code",
										as: "employee",
									},
								},
								{
									$project: {
										"employee._id": 1,
										"employee.title": 1,
										"employee.name": 1,
										"employee.code": 1,
										"employee.hourlyRate": 1,
									},
									// please notice that this stage will be applied to each item in the array "employee" which contains only one value in this case and will be extracted later via `$unwind`
								},
							],
							data: [
								{ $match: { employee: code } },
								{ $project: { _id: 1, month: 1, details: 1 } },
							],
						},
					},
					{ $unwind: "$employee" },
				])
				.toArray()
		)[0];

		res.status(200).send(queryResult);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/create-entry
export async function getCreateIncentiveEntry(req: Request, res: Response) {
	try {
		const incentiveItems = await COLLECTIONS.incentiveItems
			.find({ validTill: { $gte: new Date() } })
			.toArray();
		res.status(200).render("", incentiveItems); // TODO add view
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// POST /incentive/create-entry
export async function createIncentiveEntry(
	req: Request<{}, {}, { incentiveEntry: IncentiveEntry }>,
	res: Response
) {
	let incentiveEntry = req.body.incentiveEntry;
	const { value, error } = IncentiveEntrySchema.validate(incentiveEntry);
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	} else {
		incentiveEntry = value;
	}

	try {
		await COLLECTIONS.incentive.insertOne(incentiveEntry);
		res.status(201).redirect(`/incentive/employee/${incentiveEntry.employee}`);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/update-entry/:id
export function getUpdateIncentiveEntry(
	req: Request<{ id: string }>,
	res: Response
) {
	const id = req.params.id;
	res.status(200).render("", { id }); // TODO add the view
}

// POST /incentive/update-entry/:id
export async function updateIncentiveEntry(
	req: Request<{ id: string }, {}, { incentiveEntry: IncentiveEntry }>,
	res: Response
) {
	const id = req.params.id;
	let incentiveEntry = req.body.incentiveEntry;
	const { value, error } = IncentiveEntrySchema.validate(incentiveEntry);
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	} else {
		incentiveEntry = value;
	}

	try {
		await COLLECTIONS.incentive.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { ...incentiveEntry } }
		);
		res.status(201).redirect(`/incentive/employee/${incentiveEntry.employee}`);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/total
export async function getTotalIncentiveValue(
	req: Request<{}, {}, { code?: number; month?: string }>,
	res: Response
) {
	const { code, month } = req.body;
	let matchQuery;
	if (code && month) {
		matchQuery = { employee: code, month: month };
	} else if (code) {
		matchQuery = { employee: code };
	} else if (month) {
		matchQuery = { month };
	} else {
		matchQuery = {};
	}

	try {
		const totalIncentive = (
			await COLLECTIONS.incentive
				.aggregate([
					{ $match: matchQuery },
					{
						$lookup: {
							from: "incentive_items",
							localField: "details.item",
							foreignField: "_id",
						},
					},
					{
						$project: {
							incentive: {
								$map: {
									input: "$details",
									as: "detail",
									in: {
										$multiply: ["$$detail.item.incentive", "$$detail.quantity"],
									},
								},
							},
						},
					},
					{ $project: { totalIncentive: { $sum: "$incentive" } } },
				])
				.toArray()
		)[0];

		res.status(200).send({ totalIncentive });
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}
