import {Request, Response} from "express";
import {db} from "../database";
import {IncentiveEntry, IncentiveEntryFormInput} from "../types";
import {IncentiveEntrySchema} from "../models/IncentiveEntry";
import {ObjectId, WithId} from "mongodb";
import JOI from "joi";
import generateHTMLMonthString from "../utils/generateHTMLMonthString";
import {parseMonth} from "../utils/date-parser";

// GET /incentive
export async function getIncentiveMainPage(req: Request, res: Response) {
    res.status(200).render("Incentive/index.ejs");
}

// GET /incentive/details
export async function getIncentiveDetailsPage(req: Request, res: Response) {
    try {
        const queryResult = (
            await db.incentive
                .aggregate<{ _id: null; months: string[]; employees: number[] }>([
                    {
                        $group: {
                            _id: null,
                            months: {$addToSet: "$month"},
                            employees: {$addToSet: "$employee"},
                        },
                    },
                ])
                .toArray()
        )[0];

        const months = queryResult?.months || undefined;
        const employees = queryResult?.employees || undefined;

        res.status(200).render("Incentive/details.ejs", {months, employees});
    } catch (error) {
        res.status(400).send({message: (error as Error).message});
    }
}

// GET /incentive/details?employee={}?month={}
export async function getIncentiveDetails(
    req: Request<{}, {}, {}, { employee: string; month: string }>,
    res: Response
) {
    const employee = +req.query.employee;
    const month = req.query.month;

    try {
        const queryResult = await db.incentive
            .aggregate([
                {
                    $match: {
                        employee,
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
                        item: {$first: "$details.item"},
                        quantity: "$details.quantity",
                    },
                },
                {
                    $project: {
                        _id: "$item._id",
                        name: "$item.name",
                        incentive: "$item.incentive",
                        quantity: "$quantity",
                    },
                },
            ])
            .toArray();
        res.status(200).send(queryResult);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// GET /incentive/month/:month
export async function getIncentivePerMonth(
    req: Request<{ month: string }>,
    res: Response
) {
    const month = req.params.month;

    try {
        const queryResult = await db.incentive
            .aggregate([
                {$match: {month}},
                {$unwind: "$details"},
                {
                    $project: {
                        _id: 1,
                        employee: 1,
                        item: "$details.item",
                        quantity: "$details.quantity",
                    },
                },
                {
                    $lookup: {
                        from: "incentive_items",
                        localField: "item",
                        foreignField: "_id",
                        as: "item",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        employee: 1,
                        item: {$first: "$item"},
                        quantity: 1,
                    },
                },
                {
                    $addFields: {
                        "item.quantity": "$quantity",
                        "item.total": {
                            $multiply: ["$quantity", "$item.incentive"],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "employees",
                        localField: "employee",
                        foreignField: "code",
                        as: "employee",
                    },
                },
                {
                    $group: {
                        _id: {employee: "$employee"},
                        items: {$addToSet: "$item"},
                    },
                },
                {
                    $project: {
                        _id: 0,
                        employee: {$first: "$_id.employee.name"},
                        items: 1,
                    },
                },
            ])
            .toArray();

        if (!queryResult) {
            res.status(404).send({message: "month isn't found"});
            return;
        }

        res.status(200).send(queryResult);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
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
            await db.incentive
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
                                        _id: {$first: "$employee._id"},
                                        title: {$first: "$employee.title"},
                                        name: {$first: "$employee.name"},
                                        code: {$first: "$employee.code"},
                                        hourlyRate: {$first: "$employee.hourlyRate"},
                                    },
                                },
                                {
                                    $limit: 1,
                                },
                            ],
                            data: [
                                {$match: {employee: code}},
                                {$unwind: "$details"},
                                {
                                    $project: {
                                        _id: 1,
                                        month: 1,
                                        item: "$details.item",
                                        quantity: "$details.quantity",
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "incentive_items",
                                        localField: "item",
                                        foreignField: "_id",
                                        as: "item",
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        month: 1,
                                        item: {$first: "$item"},
                                        quantity: 1,
                                    },
                                },
                                {
                                    $addFields: {
                                        "item.quantity": "$quantity",
                                        "item.total": {
                                            $multiply: ["$quantity", "$item.incentive"],
                                        },
                                    },
                                },
                                {
                                    $group: {
                                        _id: {month: "$month"},
                                        items: {$addToSet: "$item"},
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        month: "$_id.month",
                                        items: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {$unwind: "$employee"},
                ])
                .toArray()
        )[0];

        if (!queryResult) {
            res.status(404).send({message: "employee not found"});
            return;
        }

        res.status(200).send(queryResult);
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// GET /incentive/create-entry
export async function getCreateIncentiveEntry(req: Request, res: Response) {
    try {
        const employees = await db.employees.find({}).toArray();

        const month = generateHTMLMonthString();

        const items = await db.incentiveItems
            .find({validTill: {$gte: new Date()}})
            .toArray();

        res
            .status(200)
            .render("Incentive/create-entry.ejs", {employees, month, items});
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// POST /incentive/create-entry
export async function createOrUpdateIncentiveEntry(
    req: Request<{}, {}, IncentiveEntryFormInput>,
    res: Response
) {
    let incentiveEntry: IncentiveEntry = {
        month: parseMonth(),
        employee: parseInt(req.body.employee),
        details: req.body.items.map((item, index) => ({
            item: new ObjectId(item),
            quantity: parseInt(req.body.quantities[index]),
        })),
    };

    incentiveEntry.details = incentiveEntry.details.filter((x) => x.quantity > 0);

    const {error} = IncentiveEntrySchema.fork("details", () => {
        return JOI.array()
            .items(
                JOI.object({
                    item: JOI.optional(),
                    quantity: JOI.number().min(0).max(10000),
                })
            )
            .required();
    }).validate(incentiveEntry);

    if (error) {
        res.status(400).send({message: error.message});
        return;
    }

    try {
        await db.incentive.updateOne(
            {employee: incentiveEntry.employee, month: incentiveEntry.month},
            {$set: {...incentiveEntry}},
            {upsert: true}
        );
        res.status(201).redirect("/incentive");
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}

// GET /incentive/total
export async function getTotalIncentivePage(req: Request, res: Response) {
    try {
        const queryResult:
            | { _id: null; months: string[]; employees: number[] }
            | undefined = (
            await db.incentive
                .aggregate<{ _id: null; months: string[]; employees: number[] }>([
                    {
                        $group: {
                            _id: null,
                            months: {$addToSet: "$month"},
                            employees: {$addToSet: "$employee"},
                        },
                    },
                ])
                .toArray()
        )[0];

        const months = queryResult?.months || undefined;
        const employees = queryResult?.employees || undefined;

        res.status(200).render("Incentive/total.ejs", {months, employees});
    } catch (error) {
        res.status(400).send({message: (error as Error).message});
    }
}

// GET /incentive/total/data?employee=""&month=""
export async function getTotalIncentiveValue(
    req: Request<{}, { employee?: number; month?: string }, {}>,
    res: Response
) {
    const matchQuery = {
        employee: req.query.employee ? +req.query.employee : {$exists: true},
        month: req.query.month ?? {$exists: true},
    };

    try {
        const totalIncentive = (
            await db.incentive
                .aggregate<WithId<{ value: number }>>([
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
        )[0];

        res.status(200).send({total: totalIncentive?.value || 0});
    } catch (error) {
        res.status(500).send({message: (error as Error).message});
    }
}
