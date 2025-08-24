import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDto } from './dto/start-conversation';

@Controller('/api/v1')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/conversation')
  @UsePipes(new ValidationPipe({ transform: true }))
  startConversation(@Body() startConversationDto: StartConversationDto): string {
    console.log(startConversationDto)
    return this.conversationService.startConversation();
  }
}
