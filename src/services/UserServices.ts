import { Request, Response } from "express";
import { Repository } from "typeorm";
import { PostgreDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    PostgreDataSource.getRepository(User);

  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user: User | null = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!user) {
        throw new NotFoundError(
          `User with ID ${res.locals.auth.id} not found`,
          "User Not Found"
        );
      }

      const { fullName, avatar } = req.body;

      user.fullname = fullName;
      if (avatar) {
        user.avatar = avatar;
      }
      await this.UserRepository.save(user);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Update Profile Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
