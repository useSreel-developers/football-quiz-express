import { Request, Response } from "express";
import { Repository } from "typeorm";
import { PostgreDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import { Avatar } from "../../database/entities/Avatar";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";
import BadRequestError from "../utils/exception/custom/BadRequestError";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    PostgreDataSource.getRepository(User);
  private readonly AvatarRepository: Repository<Avatar> =
    PostgreDataSource.getRepository(Avatar);

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

      const { name, avatar } = req.body;

      user.name = name;
      if (avatar) {
        if (
          !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(
            avatar
          )
        ) {
          throw new BadRequestError(
            "The sent ID is not a valid UUID format",
            "UUID Error"
          );
        }

        const avatarSelected = await this.AvatarRepository.findOne({
          where: {
            id: avatar,
          },
          relations: ["avatar_owners"],
        });

        if (!avatarSelected) {
          throw new NotFoundError(
            `Avatar with ID ${res.locals.auth.id} not found`,
            "Avatar Not Found"
          );
        }

        if (avatarSelected.price > user.diamond) {
          throw new BadRequestError(
            `Your diamonds are not enough to buy this avatar`,
            "Diamond Not Enough"
          );
        }

        if (!avatarSelected.avatar_owners.filter((owner) => owner.id === user.id).length) {
          user.diamond = user.diamond - avatarSelected.price;
          await this.UserRepository.query(
            "INSERT INTO user_avatar(user_id, avatar_id) VALUES($1, $2)",
            [user.id, avatarSelected.id]
          );
        }

        user.avatar = avatarSelected;
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
