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

export type IncentiveEntryForPayroll = {
    quantity: number;
    name: string;
    price: number;
    incentive: number;
    validTill: Date;
};

export type Bonus = {
    type: "bonus" | "deduction";
    amount: number;
    comment: string;
    month: string;
    employee: string;
    code: number;
    approved?: boolean;
};

export type BonusFormInput = {
    type: "bonus" | "deduction";
    amount: string;
    comment: string;
    month: string;
    employee: string;
};

export type SingleAttendanceInput = {
    date: Date;
    clockIn: string;
    clockOut: string;
}

export type AttendanceEntry = {
    employee: number;
    month: string;
    log: SingleAttendanceInput[]
};

export type SalaryCalculations = {
    individualCalculations: {
        mainSalary: number;
        bonuses: number;
        deductions: number;
        incentive: number;
    };
    total: number;
    details: {
        workDaysCount: number;
        totalHours: number;
        bonusList: Bonus[];
        deductionList: Bonus[];
        incentiveList: IncentiveEntryForPayroll[];
    };
};
