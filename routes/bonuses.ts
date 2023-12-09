import express from "express";
import {
	createBonus,
	getCreateBonusPage,
	getMainPage,
} from "../controllers/bonus";

const Router = express.Router();

Router.get("/", getMainPage);
Router.get("/new", getCreateBonusPage);
Router.post("/", createBonus);
Router.delete("/", () => {});
Router.get("history", () => {});

export default Router;
