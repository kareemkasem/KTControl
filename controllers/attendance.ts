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

// POST /attendance
export async function postAttendanceQuery(req: Request<{}, {}, { employee: string, month: string }>, res: Response) {
    const employee = +req.body.employee || "all"
    const month = req.body.month;
    try {
        res.status(200).redirect(`/attendance/query?employee=${employee}&month=${month}`)
    } catch (error) {
        res.status(400).send({message: (error as Error).message});
    }
}

// GET /attendance/query?employee?month
export async function getAttendanceQuery(req: Request<{ employee: string; month: string }, {}, {}>, res: Response) {
    if (req.query.employee === undefined || req.query.month === undefined) {
        res.status(400).send({message: "Invalid query"});
        return;
    }
    try {
        const employee = +req.query.employee || "all";
        const month = req.query.month;
        let query: any = {employee, month}
        if (employee !== "all" && month === "all") {
            query = {employee}
        } else if (employee === "all" && month !== "all") {
            query = {month}
        } else if (employee === "all" && month === "all") {
            query = {}
        }
        const queryResult = await db.attendance.find(query).toArray();
        res.status(200).send(queryResult);
    } catch (error) {
        res.status(400).send({message: (error as Error).message});
    }
}