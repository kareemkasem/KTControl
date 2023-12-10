import express from "express";
import {getAdminPage, getEmployeesPage, getMainPage} from "../controllers/attendance"

const Router = express.Router()

Router.get("/", getMainPage)
Router.get("/employees", getEmployeesPage)
Router.get("/admin", getAdminPage)

export default Router