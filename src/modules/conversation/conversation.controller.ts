import { Controller, Get, Post, Body, Request, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDto } from './dto/start-conversation';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/api/v1')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/conversation')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  startConversation(@Request() request, @Body() startConversationDto: StartConversationDto) {
    console.log(startConversationDto)
    return this.conversationService.startConversation(request.user.id, startConversationDto);
  }

  @Get('/conversation')
  @UseGuards(AuthGuard)
  getConversations(@Request() request) {
    return this.conversationService.getConversations(request.user.id);
  }
}
