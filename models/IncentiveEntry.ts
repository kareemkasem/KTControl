import JOI from "joi";
import { IncentiveEntry, IncentiveEntryFormInput } from "../types";
import { IncentiveItemSchema } from "./IncentiveItem";

export const IncentiveEntrySchema = JOI.object<
	IncentiveEntry | IncentiveEntryFormInput
>({
	month: JOI.string()
		.required()
		.regex(/(0[1-9]|1[0-2])\/(19|20)\d{2}/),
	employee: JOI.number().min(1).max(10000).required(),
	details: JOI.array()
		.items(
			JOI.object({
				item: IncentiveItemSchema,
				quantity: JOI.number().min(0).max(10000).required(),
			})
		)
		.required(),
});
