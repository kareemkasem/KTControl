import express from "express";
import {
	getAttendancePage,
	getAttendanceQuery,
} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getAttendancePage);
Router.get("/query", getAttendanceQuery);

export default Router;
