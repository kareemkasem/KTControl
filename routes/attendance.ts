import express from "express";
import {
	getMainPage,
	getGenerateNewMonth,
	generateNewMonth,
	getCurrentMonth,
} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getMainPage);
Router.get("/generate-new", getGenerateNewMonth);
Router.post("/generate-new", generateNewMonth);
Router.get("/current-month", getCurrentMonth);
export default Router;
