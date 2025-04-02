import express from "express";
import {getAttendancePage, postAttendanceQuery, getAttendanceQuery} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getAttendancePage);
Router.post("/", postAttendanceQuery)
Router.get("/query", getAttendanceQuery)

export default Router;