import { Request, Response } from "express";
import { Repository } from "typeorm";
import { PostgreDataSource } from "../../database/data-source";
import { Transaction } from "../../database/entities/Transaction";
import handleError from "../utils/exception/handleError";
import midtransClient from "midtrans-client";

export default new (class TransactionServices {
    private readonly TransactionRepository: Repository<Transaction> =
        PostgreDataSource.getRepository(Transaction);

    async createTransaction(req: Request, res: Response): Promise<Response> {
        try {
            // Ambil data dari request
            const { order_id, total, name, email } = req.body;

            // Inisialisasi objek Snap dari midtrans-client
            const snap = new midtransClient.Snap({
                isProduction: false,  // Ganti dengan true jika ingin ke Production Environment
                serverKey: process.env.MIDTRANS_SERVER_KEY || "", // Ambil dari environment variable
                clientKey: process.env.MIDTRANS_CLIENT_KEY || "", // Ambil dari environment variable
            });

            // Persiapkan parameter transaksi
            const parameter = {
                transaction_details: {
                    order_id: order_id,
                    gross_amount: total,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: name,
                    email: email,
                },
            };

            // Buat transaksi menggunakan Snap
            const transaction = await snap.createTransaction(parameter);

            // Simpan data transaksi ke database jika diperlukan
            const newTransaction = this.TransactionRepository.create({
                id: transaction.order_id,
                // ... tambahkan sesuai kebutuhan
            });
            await this.TransactionRepository.save(newTransaction);

            return res.status(201).json({
                code: 201,
                status: "success",
                message: "Create Transaction Success",
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
})