import express from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee, updateEmployeePassword } from "../controllers/Employee";

const router = express.Router();

router.get("/:id", getEmployee);
router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.put("/updatePassword/:id", updateEmployeePassword);
router.delete("/:id", deleteEmployee);

export default router;
