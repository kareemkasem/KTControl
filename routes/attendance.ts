import express from "express";
import { getMainPage, getGenerateNewMonth } from "../controllers/attendance";

const Router = express.Router();

Router.get("/", getMainPage);
Router.get("/generate-new", getGenerateNewMonth);

export default Router;
