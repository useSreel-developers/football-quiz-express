import http from "http";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Server as SocketServer, Socket } from "socket.io";
import swaggerUi from "swagger-ui-express";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

import apiSpec from "../utils/swagger/apiSpec";
import AuthRoutes from "../routes/AuthRoutes";
import UserRoutes from "../routes/UserRoutes";
import AvatarRoutes from "../routes/AvatarRoutes";
import socketController from "../socket/socketController";

const createServer: Express = express();

createServer.use(express.json());
createServer.use(helmet());
createServer.use(cors());

createServer.get("/", (req: Request, res: Response): Response<string> => {
  return res.status(200).send("Server Online!");
});

createServer.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));

createServer.use("/api/v1", AuthRoutes);
createServer.use("/api/v1", UserRoutes);
createServer.use("/api/v1", AvatarRoutes);

createServer.use((req: Request, res: Response): Response<string> => {
  return handleError(
    res,
    new NotFoundError("Resource on that url doesn't exist", "Not Found")
  );
});

const mainServer = http.createServer(createServer);
const io = new SocketServer(mainServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket: Socket) => {
  console.log(`Client with id ${socket.id} connected!`);

  socketController(io, socket);
});

export default mainServer;
