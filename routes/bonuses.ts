import express from "express";
import { createBonus } from "../controllers/bonus";

const Router = express.Router();

Router.get("/", () => {});
Router.post("/", createBonus);
Router.delete("/", () => {});
Router.get("history", () => {});

export default Router;
