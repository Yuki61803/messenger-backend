
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from 'src/modules/user/user.entity';

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
  async favoriteContact(user_id, contact_id) {
    let contact = await this.contactsRepository.findBy({ 
      user_id: user_id,
      contact_id: contact_id
    });
      
    
    
    if (contact?.length === 1) {
      let isFavorite = !contact[0].is_favorite;

      this.contactsRepository.update({
        user_id: user_id,
        contact_id: contact_id,
      },
      {
        is_favorite: isFavorite,
      },
      );
    }
    
    return 'Hello World!';
  }
  async blockContact(user_id, contact_id) {
    let user = await this.usersRepository.findOneBy({ 
      id: user_id,
    });

    if (user && !user.blocked_ids?.includes(contact_id.toString())) {
      if (user?.blocked_ids?.length > 0) {
        user.blocked_ids = [...user.blocked_ids, contact_id.toString()];
      } else {
        user.blocked_ids = [contact_id.toString()];
      }
      this.usersRepository.save(user);
    } else if (user) {
      user.blocked_ids.splice(user.blocked_ids.findIndex(blocked_id => blocked_id == contact_id.toString()), 1);
      this.usersRepository.save(user);
    }

    return 'success';
  }

  
  async getContactIds(user_id: string, search_text?: string) {
    let contacts = await this.contactsRepository.findBy({
      user_id: user_id
    });

    let response: Array<Contact & {
      name: string,
      is_online: boolean,
      avatar: string,
      about: string,
      status: string 
    }> = [];
 
    for (let i = 0; i < contacts.length; i++) {
      const user = await this.usersRepository.findOneBy({
        id: +contacts[i].contact_id
      });

      if (user) {
        response[i] = {
          ...contacts[i],
          name: user.name,
          is_online: user.is_online,
          avatar: user.avatar || '',
          about: user.about || '',
          status: user.status ? user.status : 'offline'
        }
      }
    }

    console.log(response, user_id);

    if (search_text && search_text?.length > 0) {
      response = response.filter((contact) => contact.name.toLowerCase().includes(search_text.toLowerCase()));
    }

    console.log(response);

    return response;
  }
}
