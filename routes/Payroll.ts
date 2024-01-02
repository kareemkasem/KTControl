import express from "express";
import { calculateSalary } from "../controllers/Payroll";

const Router = express.Router();

Router.get("/salary/:id", calculateSalary);

export default Router;
