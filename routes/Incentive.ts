import express from "express";
import {
	createOrUpdateIncentiveEntry,
	getCreateIncentiveEntry,
	getIncentiveDetails,
	getIncentiveDetailsPage,
	getIncentiveMainPage,
	getIncentivePerEmployee,
	getIncentivePerMonth,
	getTotalIncentivePage,
	getTotalIncentiveValue,
} from "../controllers/incentive";
import {
	createIncentiveItem,
	deleteIncentiveItem,
	getAllIncentiveItems,
	getCreateIncentiveItem,
	getUpdateIncentiveItem,
	updateIncentiveItem,
} from "../controllers/Incentive-items";

const Router = express.Router();

Router.get("/", getIncentiveMainPage);

Router.get("/details", getIncentiveDetailsPage);
Router.get("/details/update", getIncentiveDetails);
Router.get("/month/:month", getIncentivePerMonth);
Router.get("/employee/:code", getIncentivePerEmployee);
Router.get("employee/details", getIncentiveDetails);
Router.get("/create-entry", getCreateIncentiveEntry);
Router.post("/create-entry", createOrUpdateIncentiveEntry);
Router.get("/items", getAllIncentiveItems);
Router.get("/items/create-item", getCreateIncentiveItem);
Router.post("/items", createIncentiveItem);
Router.get("/items/:id", getUpdateIncentiveItem);
Router.post("/items/:id", updateIncentiveItem);
Router.delete("/items/:id", deleteIncentiveItem)

Router.get("/total", getTotalIncentivePage);
Router.get("/total/data", getTotalIncentiveValue);

export default Router;
