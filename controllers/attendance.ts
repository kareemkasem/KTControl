import {Request, Response} from "express"

export function getMainPage(req: Request, res: Response) {
    res.status(200).render("Attendance/index.ejs")
}

export function getEmployeesPage(req: Request, res: Response) {
    res.status(200).render("Attendance/employees.ejs")
}

export function getAdminPage(req: Request, res: Response) {
    res.status(200).render("Attendance/admin.ejs")
}