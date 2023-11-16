import JOI from "joi";
import {IncentiveEntry} from "../types";
import {IncentiveItemSchema} from "./IncentiveItem";

export const IncentiveEntrySchema = JOI.object<IncentiveEntry>({
    month: JOI.string().required().regex(/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}/),
    employee: JOI.number().min(1).max(10000).required(),
    details: JOI.object({
        item: IncentiveItemSchema,
        quantity: JOI.number().min(1).max(10000).required()
    })
})