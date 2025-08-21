
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,) {}

  async register() {

  }
  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ name: username });
  }
}