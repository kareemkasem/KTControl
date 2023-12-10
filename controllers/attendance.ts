import {Request, Response} from "express"
import {attendanceEntry, attendanceEntryFormInput} from "../types";
import {db} from "../database";
import bcrypt from "bcryptjs";

let error: string | null = null;

// GET /attendance
export function getMainPage(req: Request, res: Response) {
    res.status(200).render("Attendance/index.ejs")
    error = null
}

// GET /attendance/employees
export function getEmployeesPage(req: Request, res: Response) {
    res.status(200).render("Attendance/employees.ejs", {error})
    error = null
}

// POST /attendance/employees
export async function takeEmployeeAttendance(req: Request<{}, {}, attendanceEntryFormInput>, res: Response) {
    // * 0. correct types of the request body
    const employee = parseInt(req.body.employee)
    const password = req.body.password
    const timeStamp = new Date()
    const day = new Date().toDateString()

    if (!password) {
        error = "please enter your password"
        res.status(404).redirect("/attendance/employees")
        return
    }

    // * 1. authenticate the employee
    try {
        const employeeInDateBase = await db.employees.findOne({code: employee})
        if (!employeeInDateBase) {
            error = "employee not found"
            res.status(404).redirect("/attendance/employees")
            return
        }
        const authenticationResult = await bcrypt.compare(password, employeeInDateBase!.password)
        if (!authenticationResult) {
            error = "wrong password"
            res.status(404).redirect("/attendance/employees")
            return
        }
    } catch (error) {
        res.status(500).send({error: (error as Error).message})
        return;
    }

    // * 2. check if there is an entry with code and day in the database and add clockIn or clockOut
    try {
        const existingEntry = await db.attendance.findOne<attendanceEntry>({employee, day})
        if (!existingEntry) {
            await db.attendance.insertOne({employee, day, clockIn: timeStamp})
        } else {
            await db.attendance.updateOne({employee, day}, {$set: {clockOut: timeStamp}})
        }
    } catch (error) {
        res.status(500).send({error: (error as Error).message})
        return;
    }

    // * 4. rerender original page
    res.status(201).redirect("/attendance/employees")
}

// GET /attendance/admin
export function getAdminPage(req: Request, res: Response) {
    res.status(200).render("Attendance/admin.ejs")
    error = null
}