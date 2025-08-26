import { Injectable, NotFoundException } from '@nestjs/common';
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
        messages: []
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

  async sendMessage(author_id: string | number, message: {conversation_id: string, text: string}) {
    let conversation = await this.conversationsRepository.findOneBy({ 
      id: message.conversation_id as any // скорее всего, будет uuid, а не number
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Создаем новое сообщение
    const newMessage = {
      author_id: author_id,
      text: message.text,
      timestamp: (Date.now() / 1000).toFixed(0),
    };

    // TODO
    let messages: any = [];
    if (conversation.messages?.length > 0) messages = conversation.messages;

    conversation.messages = [...messages, newMessage];

    await this.conversationsRepository.save(conversation);

    return conversation;
  }
}