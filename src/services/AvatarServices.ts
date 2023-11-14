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
      const avatars: Avatar[] = await this.AvatarRepository.find();

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find All Avatar Success",
        data: avatars,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
