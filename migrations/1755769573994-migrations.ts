import { QueryRunner } from "typeorm";

export class Migrations1755769573994 {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_online boolean NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            phone VARCHAR(30) NULL,
            b24_id VARCHAR(30) NULL,
            b24_member_id VARCHAR(40) NULL,
            about VARCHAR(500) NULL,
            avatar VARCHAR(50) NULL,
            status VARCHAR(10) NULL,
            blocked_ids TEXT[] NULL,
          );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
