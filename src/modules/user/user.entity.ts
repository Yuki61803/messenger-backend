import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  is_online: boolean;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  b24_id?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  b24_member_id?: string;
}

