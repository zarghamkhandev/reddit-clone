import {MigrationInterface, QueryRunner} from "typeorm";

export class postchanged1601557966630 implements MigrationInterface {
    name = 'postchanged1601557966630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a"`);
    }

}
