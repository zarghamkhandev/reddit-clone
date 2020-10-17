import {MigrationInterface, QueryRunner} from "typeorm";

export class upvotesadded1602953203924 implements MigrationInterface {
    name = 'upvotesadded1602953203924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upvotes" ("userId" integer NOT NULL, "postId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_e618d2480350a67f1e02ada5fc7" PRIMARY KEY ("userId", "postId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "upvotes"`);
    }

}
