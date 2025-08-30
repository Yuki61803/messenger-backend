import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { WsGuard } from 'src/modules/auth/ws.guard';
import { ContactService } from 'src/modules/contact/contact.service';
import { Conversation } from 'src/modules/conversation/conversation.entity';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { FileMessage } from 'src/modules/conversation/dto/file-message.dto';
import { TextMessage } from 'src/modules/conversation/dto/text-message.dto';
import { UserService } from 'src/modules/user/user.service';
import { SendedMessage } from './dto/sended-message.dto';

import type { ReadOptions } from './dto/read-options.dto';
import type { SendMessage } from './dto/send-message.dto';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket']  })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;  
  private logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, string>();

  constructor(
    private readonly conversationService: ConversationService,
    private readonly usersService: UserService,
    private readonly wsGuard: WsGuard,
    private readonly contactService: ContactService,
  ) {}

  private heartbeatInterval: NodeJS.Timeout;

  afterInit(server: Server) {
    this.heartbeatInterval = setInterval(() => {
      server.sockets.sockets.forEach((client) => {
        const lastPing = client.data.lastPing || 0;
        if (Date.now() - lastPing > 40000) {
          this.handleDisconnect(client);
          client.disconnect();
        }
      });
    }, 30000);
  }

  async handleConnection(client: Socket) {
    let cookies = client.handshake.headers.cookie;
    if (cookies) {
      let token = this.wsGuard.parseCookie(cookies, 'access_token');
      if (token) {
        client.data.user = await this.wsGuard.manualCanActivate(token);
        console.log(client.data.user);
      };
    }

    if (client.data?.user?.id) {
      client.data.lastPing = Date.now();

      this.usersService.setOnline(client.data.user.id);
      this.connectedUsers.set((client.data.user.id).toString(), client.id);
      
      const contacts = await this.contactService.getContactIds(client.data.user.id);

      for (let contact of contacts) {
        let contactId = this.connectedUsers.get((contact.contact_id).toString());

        if (contactId) {
          this.server.to(contactId).emit('online', {
            my_id: client.data.user.id
          });
        }
      }
    }
    

    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    if (client.data?.user?.id) {
      this.usersService.setOffline(client.data.user.id);
      this.connectedUsers.delete((client.data.user.id).toString());
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, sendMessage: SendMessage) {
    let sendedMessage: SendedMessage | undefined;

    if (sendMessage.type == 'text') {
      sendedMessage = await this.conversationService.sendMessage(client.data.user.id, {
        conversation_id: sendMessage.conversation_id,
        text: sendMessage.text,
        type: 'text'
      })
    }
    if (sendMessage.type == 'file') {
      sendedMessage = await this.conversationService.sendMessage(client.data.user.id, {
        conversation_id: sendMessage.conversation_id,
        file_urls: sendMessage.file_urls,
        text: sendMessage.text,
        type: 'file'
      })
    }


    if (sendedMessage) {
      for (let participantId of sendedMessage.conversation.participants.filter((elem) => elem != client.data.user.id)) {
        let clientId = this.connectedUsers.get((participantId).toString());

        if (clientId) {
          this.server.to(clientId).emit('message', {
            conversationId: sendedMessage.conversation.id,
            message: sendedMessage.message
          });
        }
      }
    }
    

    client.emit("message", "success");
    return 'success';
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('read')
  handleRead(client: Socket, options: ReadOptions) {
    this.conversationService.readMessages(client.data.user.id, options);

    client.emit("read", "success");
    return 'success';
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joined_room', room);
  }
}