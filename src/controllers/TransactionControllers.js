// import { Request, Response } from "express";

// const { TransactionServices } = require("../services/TransactionServices");

// export default new (class TransactionControllers {
//     createTransaction(req: Request, res: Response) {
//         TransactionServices.createTransaction(req, res);
//     }
// })
const { Request, Response } = require("express");
const TransactionServices = require("../services/TransactionServices");

module.exports = new (class TransactionControllers {
    createTransaction(req, res) {
        TransactionServices.createTransaction(req, res);
    }
})