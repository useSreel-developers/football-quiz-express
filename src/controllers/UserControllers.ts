import { Request, Response } from "express";
import UserServices from "../services/UserServices";
import runValidation from "../utils/validator/runValidation";
import { updateProfileSchema } from './../utils/validator/schema/userSchema';

export default new (class UserControllers {
  updateProfile(req: Request, res: Response) {
    if (runValidation(req, res, updateProfileSchema) === "VALID") {
      UserServices.updateProfile(req, res);
    }
  }
})();
