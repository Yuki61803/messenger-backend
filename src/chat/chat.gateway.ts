import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { WsGuard } from 'src/auth/ws.guard';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket']  })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;  
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly conversationService: ConversationService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { conversation_id: string; text: string }) {
    this.conversationService.sendMessage(client.data.user.id, {
      conversation_id: payload.conversation_id,
      text: payload.text
    })

    client.emit("message", "success");
    return 'success';
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joined_room', room);
  }
}