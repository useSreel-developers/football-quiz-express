import { Request, Response } from "express";
import AvatarServices from "../services/AvatarServices";

export default new (class AvatarControllers {
  findAllAvatars(req: Request, res: Response) {
    AvatarServices.findAllAvatars(req, res);
  }
})();
