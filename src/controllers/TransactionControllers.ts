import { Request, Response } from "express";
import TransactionServices from "../services/TransactionServices";

export default new (class TransactionControllers {
    createTransaction(req: Request, res: Response) {
        TransactionServices.createTransaction(req, res);
    }
})