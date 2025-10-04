
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


  async save(userData: Partial<User>) {
    let user = await this.usersRepository.insert(userData);

    return user;
  }
  async findOneById(user_id: string | number) {
    let user = await this.usersRepository.findOneBy({ id: user_id as any});
    if (user) user.password = '';

    return user;
  }
  async findUsers(text: string) {
    //Try find by name
    let users = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.name ILIKE :name", { name: `%${text}%` })
        .getMany();

    for (let i = 0; i < users.length; i++) {
      users[i].password = '';
    }

    return users;
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
  async updateOne(user_id: number, user_data: User) {
    await this.usersRepository.update({
      id: user_id 
    }, user_data);
  }
  async setOnline(user_id: number) {
    await this.usersRepository.update({
      id: user_id 
    }, {
      is_online: true
    })
  }
  async setOffline(user_id: number) {
    await this.usersRepository.update({
      id: user_id 
    }, {
      is_online: false
    })
  }
  async changeStatus(user_id: number, status: 'online' | 'offline') {
    if (status == 'online') {
      await this.usersRepository.update({
        id: user_id 
      }, {
        is_online: true 
      });
    } 

    if (status == 'offline') {
      await this.usersRepository.update({
        id: user_id 
      }, {
        is_online: false
      });
    }
  }
}
