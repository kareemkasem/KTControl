import {Request, Response} from "express";
import {COLLECTIONS} from "../database";
import {IncentiveEntryFormInput} from "../types";
import {IncentiveEntrySchema} from "../models/IncentiveEntry";
import {ObjectId, WithId} from "mongodb";
import {transformIncentiveDetails} from "../utils/transformIncentiveDetails";
import JOI from "joi";

// * Testing ✅
// GET /incentive
export async function getIncentiveMainPage(req: Request, res: Response) {
    res.status(200).render("Incentive/index.ejs");
}

// * Testing ✅
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
                        $match: {month},
                    },
                    {
                        $lookup: {
                            from: "employees",
                            localField: "employee",
                            foreignField: "code",
                            as: "employee",
                        },
                    },
                    {$unwind: "$employee"},
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

        if (!queryResult) {
            res.status(404).send({message: "month isn't found"})
            return;
        }

        res.status(200).send(queryResult);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// * Testing ✅
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
                                {$match: {employee: code}},
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
                                        _id: "employee._id",
                                        title: "employee.title",
                                        name: "employee.name",
                                        code: "employee.code",
                                        hourlyRate: "employee.hourlyRate",
                                    },
                                    // please notice that this stage will be applied to each item in the array "employee" which contains only one value in this case and will be extracted later via `$unwind`
                                },
                            ],
                            data: [
                                {$match: {employee: code}},
                                {$project: {_id: 1, month: 1, details: 1}},
                            ],
                        },
                    },
                    {$unwind: "$employee"},
                ])
                .toArray()
        )[0];

        if (!queryResult) {
            res.status(404).send({message: "employee not found"})
            return;
        }

        res.status(200).send(queryResult);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// * Testing ✅
// GET /incentive/create-entry
export async function getCreateIncentiveEntry(req: Request, res: Response) {
    try {
        const incentiveItems = await COLLECTIONS.incentiveItems
            .find({validTill: {$gte: new Date()}})
            .toArray();
        res.status(200).render("", incentiveItems); // TODO add view
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

//* Testing ✅
// POST /incentive/create-entry
export async function createIncentiveEntry(
    req: Request<{}, {}, IncentiveEntryFormInput>,
    res: Response
) {
    let incentiveEntry = req.body;
    const {error} = IncentiveEntrySchema.fork("details", () => {
        return JOI.array()
            .items(
                JOI.object({
                    item: JOI.string().required(),
                    quantity: JOI.number().min(1).max(10000).required(),
                })
            )
            .required();
    }).validate(incentiveEntry);

    if (error) {
        res.status(400).send({message: error.message});
        return;
    }

    try {
        incentiveEntry = await transformIncentiveDetails(incentiveEntry);
        console.log(incentiveEntry);

        await COLLECTIONS.incentive.insertOne(incentiveEntry);
        res.status(201).redirect(`/incentive/employee/${incentiveEntry.employee}`);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// * Testing ✅
// GET /incentive/update-entry/:id
export function getUpdateIncentiveEntry(
    req: Request<{ id: string }>,
    res: Response
) {
    const id = req.params.id;
    res.status(200).render("", {id}); // TODO add the view
}

//* Testing ✅
// POST /incentive/update-entry/:id
export async function updateIncentiveEntry(
    req: Request<{ id: string }, {}, IncentiveEntryFormInput>,
    res: Response
) {
    const id = req.params.id;
    let incentiveEntry = req.body;
    const {value, error} = IncentiveEntrySchema.fork("details", () => {
        return JOI.array()
            .items(
                JOI.object({
                    item: JOI.string().required(),
                    quantity: JOI.number().min(1).max(10000).required(),
                })
            )
            .required();
    }).validate(incentiveEntry);

    if (error) {
        res.status(400).send({message: error.message});
        return;
    } else {
        incentiveEntry = value as IncentiveEntryFormInput;
    }

    try {
        incentiveEntry = await transformIncentiveDetails(incentiveEntry);

        await COLLECTIONS.incentive.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...incentiveEntry}}
        );
        res.status(201).redirect(`/incentive/employee/${incentiveEntry.employee}`);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// * Testing ✅
// GET /incentive/total
export async function getTotalIncentiveValue(
    req: Request<{}, { code?: number; month?: string }, {}>,
    res: Response
) {
    const {code, month} = req.query;
    let matchQuery;
    if (code && month) {
        matchQuery = {employee: code, month: month};
    } else if (code) {
        matchQuery = {employee: code};
    } else if (month) {
        matchQuery = {month};
    } else {
        matchQuery = {};
    }

    try {
        const totalIncentive = (
            await COLLECTIONS.incentive
                .aggregate([
                    {$match: matchQuery},
                    {$unwind: "$details"},
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
                            incentive: {$first: "$details.item.incentive"},
                            quantity: "$details.quantity",
                        },
                    },
                    {
                        $group: {
                            _id: "_id",
                            value: {
                                $sum: {
                                    $multiply: ["$incentive", "$quantity"],
                                },
                            },
                        },
                    },
                ])
                .toArray()
        )[0] as WithId<{ value: number }>;

        res.status(200).send({total: totalIncentive.value});
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}
