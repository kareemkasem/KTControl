import JOI from "joi";
import { Bonus } from "../types";

export const BonusSchema = JOI.object<Bonus>({
	type: JOI.string().lowercase().valid("bonus", "deduction").required(),
	amount: JOI.number().min(1).required(),
	comment: JOI.string().required(),
	month: JOI.string()
		.regex(/(0[1-9]|1[0-2])-(19|20)\d{2}/)
		.required(),
});
