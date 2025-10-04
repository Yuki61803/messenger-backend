import { Controller, Get, Post, Body, Request, UsePipes, ValidationPipe, UseGuards, Query, Param } from '@nestjs/common';
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

  @Get('/conversation/overview')
  @UseGuards(AuthGuard)
  getConversationsOverview(@Request() request) {
    return this.conversationService.getConversationsOverview(request.user.id);
  }

  @Get('/conversation/all')
  @UseGuards(AuthGuard)
  getConversations(@Request() request) {
    console.log(request.user);
    return this.conversationService.getConversations(request.user.id);
  }

  @Get('/conversation/user/:id')
  @UseGuards(AuthGuard)
  async getConversationWithUserId(@Request() request, @Param('id') id: number) {
    return await this.conversationService.getConversationWithUserId(id, request.user.id);
  }

  @Get('/conversation/:id')
  @UseGuards(AuthGuard)
  async getConversationById(@Request() request, @Param('id') id: number) {
    return await this.conversationService.getConversationById(id, request.user.id);
  }

  @Post('/conversation')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  startConversation(@Request() request, @Body() startConversationDto: StartConversationDto) {
    return this.conversationService.startConversation(request.user.id, startConversationDto);
  }
}
