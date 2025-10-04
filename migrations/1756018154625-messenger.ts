import { MigrationInterface, QueryRunner } from "typeorm";

export class Messenger1756018154625 {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS conversations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NULL,
            participants TEXT[] NOT NULL,
            messages JSONB NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );`,
        );

        await queryRunner.query(
          `CREATE INDEX idx_messages_sender ON conversations USING GIN ((messages->'messages') jsonb_path_ops);`,
        );
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
