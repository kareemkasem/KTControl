import { Request, Response } from "express";
import { db } from "../database";
import { ObjectId } from "mongodb";
import { IncentiveItem, IncentiveItemFormInput } from "../types";
import { IncentiveItemSchema } from "../models/IncentiveItem";
import { parseDate } from "../utils/date-parser";

// GET /incentive/items
export async function getAllIncentiveItems(req: Request, res: Response) {
	try {
		const items = await db.incentiveItems
			.find()
			.sort({ validTill: "desc" })
			.toArray();
		res.status(200).render("Incentive/items", { items });
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/items/:id
export async function getUpdateIncentiveItem(
	req: Request<{ id: string }>,
	res: Response
) {
	const id = req.params.id;
	try {
		const item = await db.incentiveItems.findOne({
			_id: new ObjectId(id),
		});
		if (!item) {
			res.status(404).send({ message: "item not found" });
			return;
		}
		res.status(200).render("Incentive/update-item", {
			...item,
			validTill: parseDate(item.validTill),
		});
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// GET /incentive/items/create-item
export function getCreateIncentiveItem(req: Request, res: Response) {
	res.status(200).render("Incentive/create-item.ejs");
}

// POST /incentive/items
export async function createIncentiveItem(
	req: Request<{}, {}, IncentiveItemFormInput>,
	res: Response
) {
	const { incentive, name, price, validTill } = req.body;
	const incentiveItem: IncentiveItem = {
		name,
		price: parseFloat(price),
		incentive: parseFloat(incentive),
		validTill: new Date(validTill),
	};
	const { error } = IncentiveItemSchema.validate(incentiveItem);

	if (error) {
		res.status(400).send({ message: error.message });
		return;
	}

	try {
		await db.incentiveItems.insertOne(incentiveItem);
		res.status(200).redirect("/incentive/items");
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// POST /incentive/items/:id
export async function updateIncentiveItem(
	req: Request<{ id: string }, {}, IncentiveItemFormInput>,
	res: Response
) {
	const id = req.params.id;
	let { name, price, incentive, validTill } = req.body;
	const incentiveItem: IncentiveItem = {
		name,
		price: parseFloat(price),
		incentive: parseFloat(incentive),
		validTill: new Date(validTill),
	};

	const { error } = IncentiveItemSchema.validate(incentiveItem);
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	}

	try {
		const { matchedCount, modifiedCount } = await db.incentiveItems.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { ...incentiveItem } }
		);
		if (matchedCount !== 1 && modifiedCount !== 1) {
			res.status(404).send({ message: "item not found" });
			return;
		} else {
			res.status(201).redirect(`/incentive/items`);
		}
	} catch (error) {
		res.status(500).send({ message: (error as Error).message });
	}
}

// DELETE /incentive/items/:id
export async function deleteIncentiveItem(req: Request<{id: string}>, res: Response<{message: string}>){
``
	const id =  req.params.id
	console.log(req)
	try {
		const { deletedCount } = await db.incentiveItems.deleteOne({
			_id: new ObjectId(id),
		});
		if (deletedCount !== 1) {
			res.status(404).send({ message: "item not found" });
			return;
		}
		res.status(200).send({ message: "deletion succeeded" });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}