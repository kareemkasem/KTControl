import express from "express";
import {
    getAdminPage,
    getDayOffPage,
    getEmployeesPage,
    getHistoryPage,
    getMainPage,
    getOvertimePage,
    postDayOff,
    takeEmployeeAttendance
} from "../controllers/attendance"

const Router = express.Router()

Router.get("/", getMainPage)
Router.get("/employees", getEmployeesPage)
Router.post("/employees", takeEmployeeAttendance)
Router.get("/admin", getAdminPage)
Router.get("/overtime", getOvertimePage)
Router.get("/history", getHistoryPage)
Router.get("/dayoff", getDayOffPage)
Router.post("/dayoff", postDayOff)

export default Router