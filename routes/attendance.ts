import express from "express";
import {
    getAdminPage,
    getEmployeesPage,
    getHistoryPage,
    getMainPage,
    getOvertimePage,
    takeEmployeeAttendance
} from "../controllers/attendance"

const Router = express.Router()

Router.get("/", getMainPage)
Router.get("/employees", getEmployeesPage)
Router.post("/employees", takeEmployeeAttendance)
Router.get("/admin", getAdminPage)
Router.get("/overtime", getOvertimePage)
Router.get("/history", getHistoryPage)

export default Router