import { QueryRunner } from "typeorm";

export class Migrations1755769573994 {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_online boolean NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            phone VARCHAR(30) NULL,
            b24_id VARCHAR(30) NULL,
            b24_member_id VARCHAR(30) NULL
          );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
