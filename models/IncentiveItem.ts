import JOI from "joi";
import {IncentiveItem} from "../types";

export const IncentiveItemSchema = JOI.object<IncentiveItem>({
    name: JOI.string().required(),
    price: JOI.number().required(),
    incentive: JOI.number().required(),
    validTill: JOI.date().required()
}).custom((val: IncentiveItem): IncentiveItem => {
    let {price , incentive} = val

    if(incentive > price){
        throw new Error("incentive value can't exceed the price")
    }

    return val
})