import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationService {
  startConversation(): string {
    return 'Hello World!';
  }
}