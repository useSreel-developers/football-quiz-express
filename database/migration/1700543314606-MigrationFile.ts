import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationFile1700543314606 implements MigrationInterface {
    name = 'MigrationFile1700543314606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avatars" ("id" uuid NOT NULL, "avatar_url" text NOT NULL, "avatar_name" character varying(50) NOT NULL, "price" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_224de7bae2014a1557cd9930ed7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "diamond" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "avatar_id" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL, "question" character varying(250) NOT NULL, "answer_a" character varying(100) NOT NULL, "answer_b" character varying(100) NOT NULL, "answer_c" character varying(100) NOT NULL, "answer_d" character varying(100) NOT NULL, "correct_answer" character varying(1) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_avatar" ("avatar_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_eb55b641724916df780aa4e0c53" PRIMARY KEY ("avatar_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48db3734242b6970badc8a75c3" ON "user_avatar" ("avatar_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_90a1254abd9cce470f8cbea3b1" ON "user_avatar" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "user_avatar" ADD CONSTRAINT "FK_48db3734242b6970badc8a75c36" FOREIGN KEY ("avatar_id") REFERENCES "avatars"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_avatar" ADD CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_avatar" DROP CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18"`);
        await queryRunner.query(`ALTER TABLE "user_avatar" DROP CONSTRAINT "FK_48db3734242b6970badc8a75c36"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90a1254abd9cce470f8cbea3b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48db3734242b6970badc8a75c3"`);
        await queryRunner.query(`DROP TABLE "user_avatar"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "avatars"`);
    }

}
