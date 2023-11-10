import { Request, Response } from "express";
import { Repository } from "typeorm";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import Env from "../utils/variables/Env";
import { PostgreDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";
import BadRequestError from "../utils/exception/custom/BadRequestError";

export default new (class AuthServices {
  private readonly UserRepository: Repository<User> =
    PostgreDataSource.getRepository(User);

  async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      const client = new OAuth2Client(Env.GOOGLE_CLIENT_ID);

      const response = await client.verifyIdToken({
        idToken: req.body.tokenId,
        audience: Env.GOOGLE_CLIENT_ID,
      });
      const data = response.getPayload();

      if (!data?.email_verified) {
        throw new BadRequestError(
          `Email ${data?.email} not verified by google`,
          "Email Not verified"
        );
      }

      const userSelected = await this.UserRepository.findOne({
        where: {
          email: data?.email,
        },
      });

      // Jika user dengan email sudah terdaftar (LOGIN)
      if (userSelected) {
        const token = jwt.sign({ id: userSelected.id }, Env.JWT_SECRET, {
          expiresIn: 604800,
        });

        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Login Success",
          token,
        });
      }

      // Jika user belum ada (REGISTER)
      const user = new User();
      user.id = uuidv4();
      user.fullname = data?.name || "";
      user.email = data?.email || "";
      user.google_id = req.body.tokenId;
      await this.UserRepository.save(user);

      const token = jwt.sign({ id: user.id }, Env.JWT_SECRET, {
        expiresIn: 604800,
      });

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Register Success",
        token,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async check(req: Request, res: Response) {
    try {
      const userSelected: User | null = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!userSelected) {
        throw new NotFoundError(
          `User with ID ${res.locals.auth.id} not found`,
          "User Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Token Is Valid",
        data: userSelected,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
