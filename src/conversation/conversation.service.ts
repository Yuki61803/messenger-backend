import { Injectable, NotFoundException } from '@nestjs/common';
import { StartConversationDto } from './dto/start-conversation';
import { Conversation } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ArrayContains } from 'typeorm';
import { User } from '../user/user.entity';
import { FileMessage } from './dto/file-message.dto';
import { TextMessage } from './dto/text-message.dto';

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

  //TODO
  async sendMessage(author_id: string | number, message: {conversation_id: string, text: string, type: string, file_urls?: string[]} | any) {
    let conversation = await this.conversationsRepository.findOneBy({ 
      id: message.conversation_id as any // скорее всего, будет uuid, а не number
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Создаем новое сообщение
    if (message.type == 'text') {
      const timestamp = (Date.now() / 1000).toFixed(0);
      const newMessage: TextMessage = {
        author_id: author_id,
        text: message.text,
        readed_by: [],
        status: 'default',
        type: 'text',
        created_at: timestamp,
        updated_at: timestamp
      };

      // TODO
      let messages: any = [];
      if (conversation.messages?.length > 0) messages = conversation.messages;

      conversation.messages = [...messages, newMessage];

      await this.conversationsRepository.save(conversation);
    }
    if (message.type == 'file' && message.file_urls) {
      const timestamp = (Date.now() / 1000).toFixed(0);
      const newMessage: FileMessage = {
        author_id: author_id,
        text: message.text,
        file_urls: message.file_urls,
        readed_by: [],
        status: 'default',
        type: 'file',
        created_at: timestamp,
        updated_at: timestamp
      };

      // TODO
      let messages: any = [];
      if (conversation.messages?.length > 0) messages = conversation.messages;

      conversation.messages = [...messages, newMessage];

      await this.conversationsRepository.save(conversation);
    }
    

    
    return conversation;
  }
}