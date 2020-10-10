import {MigrationInterface, QueryRunner} from "typeorm";

export class postToUserRelationAdded1602334401469 implements MigrationInterface {
    name = 'postToUserRelationAdded1602334401469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "text" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "points" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "creatorId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c07f375e63832303f0a5049b776" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c07f375e63832303f0a5049b776"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "points"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "text"`);
    }

}
