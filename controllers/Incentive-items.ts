import { Request, Response } from "express";
import { COLLECTIONS } from "../database";
import { ObjectId } from "mongodb";
import { IncentiveItem } from "../types";
import { IncentiveItemSchema } from "../models/IncentiveItem";

// GET /incentive/items
export async function getAllIncentiveItems(req: Request, res: Response) {
	try {
		const items = await COLLECTIONS.incentiveItems.find().toArray();
		res.status(200).send(items);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/items/:id
export async function getIncentiveItem(
	req: Request<{ id: string }>,
	res: Response
) {
	const id = req.params.id;
	try {
		const item = await COLLECTIONS.incentiveItems.findOne({
			_id: new ObjectId(id),
		});
		if (!item) {
			res.status(404).send({ message: "item not found" });
			return;
		}
		res.status(200).send(item);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/items/create-item
export function getCreateIncentiveItem(req: Request, res: Response) {
	res.status(200).render(""); // TODO: add the view
}

// POST /incentive/items
export async function createIncentiveItem(
	req: Request<{}, {}, IncentiveItem>,
	res: Response
) {
	let incentiveItem = req.body;
	const { value, error } = IncentiveItemSchema.validate(incentiveItem);
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	} else {
		incentiveItem = value;
	}

	try {
		await COLLECTIONS.incentiveItems.insertOne(incentiveItem);
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/items/update-item/:id
export function getUpdateIncentiveItem(
	req: Request<{ id: string }>,
	res: Response
) {
	const id = req.params.id;
	res.status(200).render("", { id }); // TODO: add the view
}

// POST /incentive/items/update-item/:id
export async function updateIncentiveItem(
	req: Request<{ id: string }, {}, IncentiveItem>,
	res: Response
) {
	const id = req.params.id;
	let incentiveItem = req.body;
	const { value, error } = IncentiveItemSchema.validate(incentiveItem);
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	} else {
		incentiveItem = value;
	}

	try {
		const { matchedCount, modifiedCount } =
			await COLLECTIONS.incentiveItems.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { ...incentiveItem } }
			);
		if (matchedCount !== 1 && modifiedCount !== 1) {
			res.status(404).send({ message: "item not found" });
			return;
		} else {
			res.status(201).redirect(`/incentive/items/${id}`);
		}
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// DELETE /incentive/items/delete-item/:id
export async function deleteIncentiveItem(
	req: Request<{ id: string }>,
	res: Response
) {
	const id = req.params.id;

	try {
		const { deletedCount } = await COLLECTIONS.incentiveItems.deleteOne({
			_id: new ObjectId(id),
		});
		if (deletedCount === 0) {
			res
				.status(500)
				.send({
					message: "item wasn't deleted. Entry is possibly non-existent",
				});
		}
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}
