import "reflect-metadata";
import { DataSource, Transaction } from "typeorm";
import Env from "../src/utils/variables/Env";
import { User } from "./entities/User";
import { Avatar } from "./entities/Avatar";
import { Question } from "./entities/Question";
import { MigrationFile1702028107286 } from "./migration/1702028107286-MigrationFile";

export const PostgreDataSource = new DataSource({
  type: "postgres",
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USERNAME,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  synchronize: Env.NODE_ENV === "prod" ? false : true,
  logging: Env.NODE_ENV === "prod" ? false : true,
  entities: [User, Avatar, Question, Transaction],
  migrations: [MigrationFile1702028107286],
  subscribers: [],
  ssl: Env.NODE_ENV === "prod" ? true : false,
});
