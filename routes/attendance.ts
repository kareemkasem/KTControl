import express from "express";
import {getAdminPage, getEmployeesPage, getMainPage, takeEmployeeAttendance} from "../controllers/attendance"

const Router = express.Router()

Router.get("/", getMainPage)
Router.get("/employees", getEmployeesPage)
Router.post("/employees", takeEmployeeAttendance)
Router.get("/admin", getAdminPage)

export default Router