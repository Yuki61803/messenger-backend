
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Contact } from 'src/modules/contact/contact.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) {}

  async register() {

  }
  async findOneById(user_id: string | number) {
    let user = await this.usersRepository.findOneBy({ id: user_id as any});
    if (user) user.password = '';

    return user;
  }
  async findManyById(user_ids: Array<string | number>) {
    let users = await this.usersRepository.find({ 
      where: {
        id: In(user_ids)
      }
    });
    for (let user of users) {
      user.password = '';
    }

    return users;
  }
  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ name: username });
  }
  async setOnline(user_id: string | number) {
    this.usersRepository.update({
      id: user_id as any
    }, {
      is_online: true
    })
  }
  async setOffline(user_id: string | number) {
    this.usersRepository.update({
      id: user_id as any
    }, {
      is_online: false
    })
  }
}