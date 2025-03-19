import express from "express";
import {getAttendancePage} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getAttendancePage);

export default Router;