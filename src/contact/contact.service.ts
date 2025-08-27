
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    @InjectRepository(User)
          private usersRepository: Repository<User>,) {}

  async createContact(user_id, contact_id) {
    let contact = await this.contactsRepository.findBy({ 
          user_id: user_id,
          contact_id: contact_id
        });
    
    if (contact?.length === 0 && 
      await this.usersRepository.findOneBy({ id: contact_id })) {
      this.contactsRepository.insert({
        user_id: user_id,
        contact_id: contact_id,
      });
    }
    
    return 'Hello World!';
  }
  async deleteContact(user_id, contact_id) {
    let contact = await this.contactsRepository.findBy({ 
          user_id: user_id,
          contact_id: contact_id
        });
    
    if (contact?.length === 1) {
      this.contactsRepository.delete({
        user_id: user_id,
        contact_id: contact_id,
      })
    }
    
    return 'Hello World!';
  }
}