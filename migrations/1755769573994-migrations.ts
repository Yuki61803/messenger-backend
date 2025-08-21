import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755769573994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) UNIQUE NOT NULL,
            is_active VARCHAR(10) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
