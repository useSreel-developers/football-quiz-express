const { PostgreDataSource } = require("../../database/data-source");
const { Transaction } = require("../../database/entities/Transaction");
const handleError = require("../utils/exception/handleError");

const midtransClient = require("midtrans-client");

module.exports = new (class TransactionServices {
    constructor() {
        this.TransactionRepository = PostgreDataSource.getRepository(Transaction);
    }

    async createTransaction(req, res) {
        try {
            const snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
                clientKey: process.env.MIDTRANS_CLIENT_KEY,
            });

            const parameter = {
                transaction_details: {
                    order_id: req.body.order_id,
                    gross_amount: Number(req.body.total),
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: req.body.name,
                    email: req.body.email,
                },
            };

            const transaction = await snap.createTransaction(parameter);

            const newTransaction = this.TransactionRepository.create({
                id: transaction.order_id,
                user: {
                    id: res.locals.auth.id,
                    name: res.locals.auth.name,
                    email: res.locals.auth.email,
                }
            });
            await this.TransactionRepository.save(newTransaction);

            return res.status(201).json({
                code: 201,
                status: "success",
                message: "Create Transaction Success",
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                status: "failed",
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
})
