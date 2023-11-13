import express from "express";
import {
	createEmployee,
	deleteEmployee,
	getAllEmployees,
	getEmployee,
	getNewEmployeePage,
	getUpdateEmployee,
	updateEmployee,
	updateEmployeePassword,
} from "../controllers/Employee";

const router = express.Router();

router.get("/new-employee", getNewEmployeePage);
router.get("/:id", getEmployee);
router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.get("/update-employee/:id", getUpdateEmployee);
router.post("/update-employee/:id", updateEmployee);
router.post("/update-password/:id", updateEmployeePassword);
router.delete("/:id", deleteEmployee);

export default router;
