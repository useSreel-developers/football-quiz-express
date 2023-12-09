import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationFile1702142613258 implements MigrationInterface {
    name = 'MigrationFile1702142613258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "status" character varying(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
    }

}
