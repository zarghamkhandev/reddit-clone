import {MigrationInterface, QueryRunner} from "typeorm";

export class postchanged1601558219813 implements MigrationInterface {
    name = 'postchanged1601558219813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a" UNIQUE ("title")`);
    }

}
