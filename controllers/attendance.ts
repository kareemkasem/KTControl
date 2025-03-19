import {Request, Response} from "express";

// Get /attendance
export async function getAttendancePage(req: Request, res: Response) {
    res.status(200).render("Attendance/index");
}