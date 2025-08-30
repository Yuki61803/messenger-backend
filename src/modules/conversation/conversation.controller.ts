import { Controller, Get, Post, Body, Request, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDto } from './dto/start-conversation';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/api/v1')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/conversation/message')
  @UseGuards(AuthGuard)
  getMessage(@Request() request, @Query() query: {
    conversation_id: string,
    text: string
  }) {
    return this.conversationService.getMessage(request.user.id, query.conversation_id, query.text);
  }

  @Get('/conversation')
  @UseGuards(AuthGuard)
  getConversations(@Request() request) {
    return this.conversationService.getConversations(request.user.id);
  }

  @Post('/conversation')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  startConversation(@Request() request, @Body() startConversationDto: StartConversationDto) {
    console.log(startConversationDto)
    return this.conversationService.startConversation(request.user.id, startConversationDto);
  }
}
