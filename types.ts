import {ObjectId} from "mongodb";

export type WorkHours = {
    clockIn: string;
    clockOut: string;
};

export type Employee = {
    code: number;
    name: string;
    username: string;
    password: string;
    title:
        | "manager"
        | "pharmacist"
        | "assistant"
        | "trainee"
        | "delivery"
        | "other";
    hourlyRate: number;
    workHours: WorkHours;
};

export type EmployeeFormInput = {
    code: number;
    name: string;
    username: string;
    password: string;
    title:
        | "manager"
        | "pharmacist"
        | "assistant"
        | "trainee"
        | "delivery"
        | "other";
    hourlyRate: number;
    clockIn: string;
    clockOut: string;
};

export type IncentiveItem = {
    name: string;
    price: number;
    incentive: number;
    validTill: Date;
};

export type IncentiveItemFormInput = {
    name: string;
    price: string;
    incentive: string;
    validTill: string;
};

export type IncentiveEntry = {
    month: string;
    employee: number;
    details: {
        item: ObjectId;
        quantity: number;
    }[];
};

export type IncentiveEntryFormInput = {
    month: string;
    employee: string;
    items: string[];
    quantities: string[];
};

export type Bonus = {
    type: "bonus" | "deduction";
    amount: number;
    comment: string;
    month: string;
    employee: string;
    code: number;
    approved?: boolean
};

export type BonusFormInput = {
    type: "bonus" | "deduction";
    amount: string;
    comment: string;
    month: string;
    employee: string;
};

export type AttendanceEntry = {
    employee: number,
    day: string, //date string
    clockIn: Date,
    clockOut?: Date
}

export type AttendanceEntryFormInput = {
    employee: string,
    password: string,
}

export type DayOff = {
    employee: number,
    date: Date,
    comment?: string,
}

export type DayOffFormInput = {
    employee: string,
    date: string,
    comment?: string,
}