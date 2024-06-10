import express from "express";
import {
	// getAdminPage,
	// getDayOffPage,
	// getEmployeesPage,
	// getHistoryPage,
	getMainPage,
	// getOvertimePage,
	// postDayOff,
	// postEmployeeClockIn,
	// postEmployeeCLockOut,
} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getMainPage);
// Router.get("/employees", getEmployeesPage);
// Router.post("/employees/clockIn", postEmployeeClockIn);
// Router.post("employees/clockOut", postEmployeeCLockOut);
// Router.get("/admin", getAdminPage);
// Router.get("/overtime", getOvertimePage);
// Router.get("/history", getHistoryPage);
// Router.get("/dayoff", getDayOffPage);
// Router.post("/dayoff", postDayOff);

export default Router;
