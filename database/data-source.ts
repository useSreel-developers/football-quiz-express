import "reflect-metadata";
import { DataSource } from "typeorm";
import Env from "../src/utils/variables/Env";
import { User } from "./entities/User";
import { Avatar } from "./entities/Avatar";
import { Question } from "./entities/Question";
import { Transaction } from "./entities/Transaction";
import { MigrationFile1702029013122 } from "./migration/1702029013122-MigrationFile";
import { MigrationFile1702142613258 } from './migration/1702142613258-MigrationFile';

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
  migrations: [MigrationFile1702029013122, MigrationFile1702142613258],
  subscribers: [],
  ssl: Env.NODE_ENV === "prod" ? true : false,
});
