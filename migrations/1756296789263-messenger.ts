import { QueryRunner } from "typeorm";

export class Messenger1756296789263 {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL,
            contact_id VARCHAR(100) NOT NULL,
            is_favorite boolean NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
