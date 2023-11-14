import { Router } from "express";
import AvatarControllers from "../controllers/AvatarControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const AvatarRoutes = Router();

// GET | /avatars
AvatarRoutes.get("/avatars", jwtAuth, AvatarControllers.findAllAvatars);

export default AvatarRoutes;
