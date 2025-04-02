import {Request, Response} from "express";
import {db} from "../database";

// Get /attendance
export async function getAttendancePage(req: Request, res: Response) {
    try {
        const queryResult = (
            await db.attendance
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

        res.status(200).render("Attendance/index.ejs", {months, employees});
    } catch (error) {
        res.status(400).send({message: (error as Error).message});
    }
}