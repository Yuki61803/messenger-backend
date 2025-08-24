import { Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('/api/v1')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/conversation')
  startConversation(): string {
    return this.conversationService.startConversation();
  }
}
