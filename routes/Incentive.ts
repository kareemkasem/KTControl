import express from "express";
import {
	createIncentiveEntry,
	getIncentivePerEmployee,
	getIncentivePerMonth,
	getTotalIncentiveValue,
	getUpdateIncentiveEntry,
	updateIncentiveEntry,
} from "../controllers/incentive";
import {
	createIncentiveItem,
	deleteIncentiveItem,
	getAllIncentiveItems,
	getCreateIncentiveItem,
	getIncentiveItem,
	getUpdateIncentiveItem,
	updateIncentiveItem,
} from "../controllers/Incentive-items";

const Router = express.Router();

Router.get("/month/:month", getIncentivePerMonth);
Router.get("/employee/:code", getIncentivePerEmployee);
Router.get("/create-entry", getCreateIncentiveItem);
Router.post("/create-entry", createIncentiveEntry);
Router.get("/update-entry/:id", getUpdateIncentiveEntry);
Router.post("/update-entry/:id", updateIncentiveEntry);
Router.get("/items", getAllIncentiveItems);
Router.get("/items/create-item", getCreateIncentiveItem);
Router.post("/items", createIncentiveItem);
Router.get("items/update-item/:id", getUpdateIncentiveItem);
Router.post("/items/:id", updateIncentiveItem);
Router.delete("/items/:id", deleteIncentiveItem);
Router.get("/items/:id", getIncentiveItem);
Router.get("/total", getTotalIncentiveValue);

export default Router;
