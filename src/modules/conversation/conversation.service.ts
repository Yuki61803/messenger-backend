import { Injectable, NotFoundException } from '@nestjs/common';
import { StartConversationDto } from './dto/start-conversation';
import { Conversation } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ArrayContains } from 'typeorm';
import { User } from '../user/user.entity';
import { FileMessage } from './dto/file-message.dto';
import { TextMessage } from './dto/text-message.dto';
import { SendedMessage } from 'src/modules/chat/dto/sended-message.dto';
import { ReadOptions } from 'src/modules/chat/dto/read-options.dto';
import { SendMessage } from 'src/modules/chat/dto/send-message.dto';

@Injectable()
export class ConversationService {
  constructor(
      @InjectRepository(Conversation)
      private conversationsRepository: Repository<Conversation>,
      @InjectRepository(User)
        private usersRepository: Repository<User>,) {}


  async getMessage(user_id: string | number, conversation_id: any, text: string) {
    let conversation = await this.conversationsRepository.findOneBy({
      id: conversation_id,
      participants: ArrayContains([user_id])
    });

    let messageIndex = -1;

    conversation?.messages?.reverse()?.map((message: TextMessage | FileMessage, index) => {
      if (message?.text?.includes(text)) {
        messageIndex = conversation?.messages?.length - 1 - index;
      }
    })

    return messageIndex;
  }

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

  async sendMessage(author_id: string | number, message: SendMessage): Promise<SendedMessage | undefined> {
    let conversation = await this.conversationsRepository.findOneBy({ 
      id: message.conversation_id as any // скорее всего, будет uuid, а не number
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    let newMessage: TextMessage | FileMessage;
    // Создаем новое сообщение
    if (message.type == 'text') {
      const timestamp = (Date.now() / 1000).toFixed(0);
      newMessage = {
        author_id: author_id,
        text: message.text,
        readed_by: [],
        status: 'default',
        type: 'text',
        created_at: timestamp,
        updated_at: timestamp
      };

      let messages: Array<TextMessage | FileMessage> = [];
      if (conversation.messages?.length > 0) messages = conversation.messages;

      conversation.messages = [...messages, newMessage];

      await this.conversationsRepository.save(conversation);
      return {
        conversation: conversation, 
        message: newMessage
      };
    }
    if (message.type == 'file' && message.file_urls) {
      const timestamp = (Date.now() / 1000).toFixed(0);
      newMessage = {
        author_id: author_id,
        text: message.text,
        file_urls: message.file_urls,
        readed_by: [],
        status: 'default',
        type: 'file',
        created_at: timestamp,
        updated_at: timestamp
      };

      let messages: Array<TextMessage | FileMessage> = [];
      if (conversation.messages?.length > 0) messages = conversation.messages;

      conversation.messages = [...messages, newMessage];

      await this.conversationsRepository.save(conversation);
      return {
        conversation: conversation, 
        message: newMessage
      };
    }
  }

  async readMessages(user_id: string | number, payload: ReadOptions) {
    let conversation = await this.conversationsRepository.findOneBy({ 
      id: payload.conversation_id as any
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    let messages: any = conversation.messages;

    if (messages?.length > 0) {
      const lastIndex = (messages.length - 1) - payload.offset;

      for (let i = 0; i < payload.count; i++) {
        console.log(lastIndex)
        if (!messages[lastIndex - i]?.readed_by?.includes(user_id)) {
          messages[lastIndex - i].readed_by.push(user_id);
        }
      }

      conversation.messages = messages;
      await this.conversationsRepository.save(conversation);
    }

    return conversation;
  }
}