import JOI from "joi";
import {DayOff} from "../types";

export const DayOffSchema = JOI.object<DayOff>({
    employee: JOI.number().required(),
    date: JOI.date().required(),
    comment: JOI.string().default("none"),
})