import dotenv from "dotenv";

dotenv.config();

class Env {
  static NODE_ENV: string = process.env.NODE_ENV || "prod";
  static PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  static DB_HOST: string = process.env.DB_HOST || "localhost";
  static DB_PORT: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
  static DB_USERNAME: string = process.env.DB_USERNAME || "postgres";
  static DB_PASSWORD: string = process.env.DB_PASSWORD || "secret";
  static DB_NAME: string = process.env.DB_NAME || "typeorm-db";
  static JWT_SECRET: string = process.env.JWT_SECRET || "jwt_secret";
}

export default Env;
