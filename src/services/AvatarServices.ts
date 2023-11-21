import { Request, Response } from "express";
import { Repository } from "typeorm";
import { PostgreDataSource } from "../../database/data-source";
import { Avatar } from "../../database/entities/Avatar";
import handleError from "../utils/exception/handleError";

export default new (class AvatarServices {
  private readonly AvatarRepository: Repository<Avatar> =
    PostgreDataSource.getRepository(Avatar);

  async findAllAvatars(req: Request, res: Response): Promise<Response> {
    try {
      const avatars: Avatar[] = await this.AvatarRepository.find({
        order: {
          price: "ASC",
        },
        relations: ["avatar_owners"],
        select: {
          avatar_owners: {
            id: true,
          },
        },
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find All Avatar Success",
        data: avatars.map((avatar) => {
          let owned = false;

          if (avatar.price === 0) {
            owned = true;
          } else {
            owned = Boolean(
              avatar.avatar_owners.filter(
                (owner) => owner.id === res.locals.auth.id
              ).length
            );
          }

          return {
            id: avatar.id,
            avatar_url: avatar.avatar_url,
            avatar_name: avatar.avatar_name,
            price: avatar.price,
            created_at: avatar.created_at,
            updated_at: avatar.updated_at,
            owned,
          };
        }),
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
