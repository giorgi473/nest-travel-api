import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSliderTable1759578034300 implements MigrationInterface {
    name = 'CreateSliderTable1759578034300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "slider" ("id" SERIAL NOT NULL, "src" character varying NOT NULL, "title" json NOT NULL, "description" json NOT NULL, CONSTRAINT "PK_ae59f1b572454f8251212e2d3dc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "slider"`);
    }

}
