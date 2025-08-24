import { Injectable } from '@nestjs/common';
import { StartConversationDto } from './dto/start-conversation';
import { Conversation } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ArrayContains } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class ConversationService {
  constructor(
      @InjectRepository(Conversation)
      private conversationsRepository: Repository<Conversation>,
      @InjectRepository(User)
        private usersRepository: Repository<User>,) {}

  async startConversation(initiator_id: string, startConversationDto: StartConversationDto) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([initiator_id, startConversationDto.user_id])
    });

    if (conversations?.length === 0 && 
        await this.usersRepository.findOneBy({ id: parseInt(startConversationDto.user_id) })) {
      this.conversationsRepository.insert({
        name: '',
        participants: [startConversationDto.user_id, initiator_id],
        messages: JSON.stringify({})
      });
    }

    return 'Hello World!';
  }

  async getConversations(initiator_id: string) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([initiator_id])
    });

    return conversations;
  }
}