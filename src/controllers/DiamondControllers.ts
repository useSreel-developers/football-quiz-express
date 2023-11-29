import { Request, Response } from "express";
import DiamondServices from "../services/DiamondServices";
import runValidation from "../utils/validator/runValidation";
import { winningDiamondSchema } from "../utils/validator/schema/diamondSchema";

export default new (class AvatarControllers {
  winningDiamond(req: Request, res: Response) {
    if (runValidation(req, res, winningDiamondSchema) === "VALID") {
      DiamondServices.winningDiamond(req, res);
    }
  }
})();
