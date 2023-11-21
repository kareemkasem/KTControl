import {ObjectId} from "mongodb";
import {COLLECTIONS} from "../database";
import {IncentiveEntryFormInput} from "../types";

export async function serializeIncentiveDetails(
    incentiveEntry: IncentiveEntryFormInput
) {
    incentiveEntry.details = await Promise.all(incentiveEntry.details.map(async (i) => {
        const result = await COLLECTIONS.incentiveItems.findOne({
            _id: new ObjectId(i.item),
        });
        if (result === null) {
            throw new Error(`item with code "${i.item}" is not found`);
        } else {
            i.item = new ObjectId(i.item);
            return i;
        }
    }));
    return incentiveEntry;
}
