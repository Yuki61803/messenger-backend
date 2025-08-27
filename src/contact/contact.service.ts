
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private usersRepository: Repository<Contact>,) {}

  async register() {

  }
  async findOne(username: string): Promise<Contact | null> {
    //return this.usersRepository.findOneBy({ name: username });
    return null;
  }
}