import { Router } from "express";
import UserControllers from "../controllers/UserControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const UserRoutes = Router();

// PUT | /update-profile
UserRoutes.put("/update-profile", jwtAuth, UserControllers.updateProfile);

export default UserRoutes;
