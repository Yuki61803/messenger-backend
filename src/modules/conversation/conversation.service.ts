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
import { ConversationOverview } from './dto/conversation-overview.dto';
import { v4 as uuidv4 } from 'uuid';

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

  
  async getIndirectContactIds(current_user_id: string) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([current_user_id])
    });

    let contactIds = new Set<string>();
    for (let conversation of conversations) {
      let participants = conversation.participants.filter((userId: string) => +userId != +current_user_id);  
      for (let participant of participants) {
        contactIds.add(participant);
      }
    } 
    
    return Array.from(contactIds);
  }

  async startConversation(initiator_id: string, startConversationDto: StartConversationDto) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([initiator_id, startConversationDto.user_id])
    });

    if (conversations?.length === 0 && 
        await this.usersRepository.findOneBy({ id: parseInt(startConversationDto.user_id) })) {
      return this.conversationsRepository.insert({
        name: '',
        participants: [startConversationDto.user_id, initiator_id],
        messages: []
      });
    }
  }

  async getConversationWithUserId(id: number, user_id: number) {
    let conversations = await this.conversationsRepository.findBy({
      participants: ArrayContains([user_id, id])
    });

    for (let conversation of conversations) {
      if (conversation.participants.length == 2) return conversation
    }
    
    return null;
  }


  async getConversationById(id: number, user_id: number) {
    let conversation = await this.conversationsRepository.findOneBy({
      id
    });
    
    if (conversation?.participants?.includes(user_id.toString())) return conversation;
    else return null;
  }

  async getConversationsOverview(initiator_id: string) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([initiator_id])
    });
    let formattedConversations: Partial<ConversationOverview>[] = [];

    for (let conversation of conversations) {
      let formattedConversation: Partial<ConversationOverview> = {};

      formattedConversation.id = conversation.id;
      formattedConversation.messagesToRead = conversation.messages.filter((message) => !message.readed_by.includes(initiator_id.toString()))?.length;
      formattedConversation.lastMessage = conversation.messages[conversation.messages.length - 1];

      formattedConversations.push(formattedConversation);
    }

    return formattedConversations;
  }

  async getConversations(initiator_id: string) {
    let conversations = await this.conversationsRepository.findBy({ 
      participants: ArrayContains([initiator_id])
    });

    return conversations;
  }

  async sendMessage(author_id: string | number, message: SendMessage): Promise<SendedMessage | undefined> {

    let conversation: Conversation | null

    if (message.conversation_id == 'new') {
      let conversations = await this.conversationsRepository.findBy({ 
        participants: ArrayContains([message?.contact_id?.toString(), author_id.toString()])
      });
      if (conversations?.length > 0) {
        conversation = conversations[0];
      } else {
        //todo
        // @ts-ignore
        conversation = (await this.conversationsRepository.save({
          name: '',
          participants: [message?.contact_id?.toString(), author_id.toString()],
          messages: []
        })); 
      }
    } else {
      conversation = await this.conversationsRepository.findOneBy({ 
        id: message.conversation_id as any // скорее всего, будет uuid, а не number
      });
    }

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    let newMessage: TextMessage | FileMessage;
    // Создаем новое сообщение
    if (message.type == 'text') {
      const timestamp = (Date.now() / 1000).toFixed(0);
      newMessage = {
        id: uuidv4(),
        author_id: author_id,
        text: message.text,
        readed_by: [author_id.toString()],
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
        id: uuidv4(),
        author_id: author_id,
        text: message.text,
        file_urls: message.file_urls,
        readed_by: [author_id.toString()],
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
      return null; 
    }

    let messages: any = conversation.messages;

    if (messages?.length > 0) {
      const lastIndex = (messages.length - 1) - payload.offset;

      for (let i = 0; i < payload.count; i++) {
        if (!messages[lastIndex - i]?.readed_by?.includes(user_id)) {
          messages[lastIndex - i].readed_by.push(user_id.toString());
        }
      }

      conversation.messages = messages;
      await this.conversationsRepository.save(conversation);
    }

    return conversation;
  }
}
