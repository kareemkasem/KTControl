import express from "express";
import {
	createIncentiveEntry,
	getIncentiveMainPage,
	getIncentivePerEmployee,
	getIncentivePerMonth,
	getTotalIncentiveValue,
	getUpdateIncentiveEntry,
	updateIncentiveEntry,
} from "../controllers/incentive";
import {
	createIncentiveItem,
	getAllIncentiveItems,
	getCreateIncentiveItem,
	getUpdateIncentiveItem,
	updateIncentiveItem,
} from "../controllers/Incentive-items";

const Router = express.Router();

Router.get("/", getIncentiveMainPage);

Router.get("/month/:month", getIncentivePerMonth);
Router.get("/employee/:code", getIncentivePerEmployee);
Router.post("/create-entry", createIncentiveEntry);
Router.get("/update-entry/:id", getUpdateIncentiveEntry);
Router.post("/update-entry/:id", updateIncentiveEntry);
Router.get("/items", getAllIncentiveItems);
Router.get("/items/create-item", getCreateIncentiveItem);
Router.post("/items", createIncentiveItem);
Router.get("/items/:id", getUpdateIncentiveItem);
Router.post("/items/:id", updateIncentiveItem);

Router.get("/total", getTotalIncentiveValue);

export default Router;
