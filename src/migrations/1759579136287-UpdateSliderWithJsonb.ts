import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSliderWithJsonb1759579136287 implements MigrationInterface {
  name = 'UpdateSliderWithJsonb1759579136287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "src"`);
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "src" character varying(500) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "slider" ADD "title" jsonb NOT NULL`);
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "description" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "description" json NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "slider" ADD "title" json NOT NULL`);
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "src"`);
    await queryRunner.query(
      `ALTER TABLE "slider" ADD "src" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "slider" DROP COLUMN "created_at"`);
  }
}
