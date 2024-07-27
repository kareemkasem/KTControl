import express from "express";
import {
	getMainPage,
	getGenerateNewMonth,
	generateNewMonth,
} from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getMainPage);
Router.get("/generate-new", getGenerateNewMonth);
Router.post("/generate-new", generateNewMonth);
export default Router;
