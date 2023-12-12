import {Request, Response} from "express"
import {attendanceEntry, attendanceEntryFormInput, Employee} from "../types";
import {db} from "../database";
import bcrypt from "bcryptjs";
import workHoursDiff from "../utils/workHoursDiff";

const EMPLOYEE_DELAY_LIMIT = 30 // to be overridden via admin configuration
const MAX_EMPLOYEE_DELAY_LIMIT = 120 // to be overridden via admin configuration
const state: { error: string | null, submissionTrials: number } = {
    error: null,
    submissionTrials: 0
}

// GET /attendance
export function getMainPage(req: Request, res: Response) {
    res.status(200).render("Attendance/index.ejs")
}

// GET /attendance/employees
export function getEmployeesPage(req: Request, res: Response) {
    res.status(200).render("Attendance/employees.ejs", {error: state.error})
    state.error = null
}

// POST /attendance/employees
export async function takeEmployeeAttendance(req: Request<{}, {}, attendanceEntryFormInput>, res: Response) {
    const employee = parseInt(req.body.employee)
    const password = req.body.password

    const timeStamp = new Date()
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000)).toDateString()

    let employeeInDateBase: Employee | null = null;

    // password check
    if (!password) {
        state.error = "please enter your password"
        res.status(404).redirect("/attendance/employees")
        return
    }

    // authentication
    try {
        employeeInDateBase = await db.employees.findOne({code: employee})
        if (!employeeInDateBase) {
            state.error = "employee not found"
            res.status(404).redirect("/attendance/employees")
            return
        }
        const authenticationResult = await bcrypt.compare(password, employeeInDateBase!.password)
        if (!authenticationResult) {
            state.error = "wrong password"
            res.status(404).redirect("/attendance/employees")
            return
        }
    } catch (error) {
        res.status(500).send({error: (error as Error).message})
        return;
    }

    // timestamp submission
    try {
        const existingEntryForToday = await db.attendance.findOne<attendanceEntry>({employee, day: today})
        if (!existingEntryForToday) {
            // check for time difference
            if (state.submissionTrials === 0) {
                const timeDifference = workHoursDiff(employeeInDateBase.workHours.clockIn)
                if (Math.abs(timeDifference) >= MAX_EMPLOYEE_DELAY_LIMIT) {
                    state.error = `WARNING: the timestamp submitted for employee ${employeeInDateBase.name} has a ${timeDifference} minutes difference from original clock In. submit again if you're sure the code is correct.`
                    state.submissionTrials++
                    res.status(404).redirect("/attendance/employees")
                    return;
                }
            }

            // TODO add penalty check
            await db.attendance.insertOne({employee, day: today, clockIn: timeStamp})
        } else {
            // check If it's a resubmission
            if (existingEntryForToday.clockOut) {
                state.error = `employee ${employeeInDateBase.name} has already registered clockIn and clockOut today. if you're sure about this operation please contact the admin to register your overtime`
                res.status(404).redirect("/attendance/employees")
                return;
            }

            // check the time difference
            if (state.submissionTrials === 0) {
                const timeDifference = workHoursDiff(employeeInDateBase.workHours.clockOut)
                if (Math.abs(timeDifference) >= MAX_EMPLOYEE_DELAY_LIMIT) {
                    state.error = `WARNING: the timestamp submitted for employee ${employeeInDateBase.name} has a ${timeDifference} minutes difference from original clock out. submit again if you're sure the code is correct.`
                    state.submissionTrials++
                    res.status(404).redirect("/attendance/employees")
                    return;
                }
            }

            // check for overnight shifts
            const existingEntryForYesterday = await db.attendance.findOne<attendanceEntry>({employee, day: yesterday})
            if (existingEntryForYesterday && existingEntryForYesterday.clockOut) {
                // TODO add penalty check
                await db.attendance.updateOne({employee, day: yesterday}, {$set: {clockOut: timeStamp}})
            } else {
                // TODO add penalty check
                await db.attendance.updateOne({employee, day: today}, {$set: {clockOut: timeStamp}})
            }
        }
    } catch (error) {
        res.status(500).send({error: (error as Error).message})
        return;
    }

    state.submissionTrials = 0
    res.status(201).redirect("/attendance/employees")
}

// GET /attendance/admin
export function getAdminPage(req: Request, res: Response) {
    res.status(200).render("Attendance/admin.ejs")
}