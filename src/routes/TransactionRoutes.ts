import { Router } from "express";
import TransactionControllers from "../controllers/TransactionControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const TransactionRoutes = Router();

TransactionRoutes.post("/transaction", jwtAuth, TransactionControllers.createTransaction);

export default TransactionRoutes;