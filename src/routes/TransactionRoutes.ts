import { Router } from "express";
import { jwtAuth } from "../middlewares/jwtAuth";

const TransactionControllers = require("../controllers/TransactionControllers.js");

const TransactionRoutes = Router();

TransactionRoutes.post("/transaction", jwtAuth, TransactionControllers.createTransaction);

export default TransactionRoutes;