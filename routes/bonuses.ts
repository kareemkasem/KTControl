import express from "express";
import {
    approveBonus,
    createBonus,
    deleteBonus,
    getCreateBonusPage,
    getHistoryPage,
    getMainPage,
} from "../controllers/bonuses";

const Router = express.Router();

Router.get("/", getMainPage);
Router.get("/new", getCreateBonusPage);
Router.post("/", createBonus);
Router.put("/approve/:id", approveBonus)
Router.delete("/:id", deleteBonus);
Router.get("/history", getHistoryPage);

export default Router;
