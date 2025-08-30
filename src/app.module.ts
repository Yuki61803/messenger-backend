import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './modules/conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Conversation } from './modules/conversation/conversation.entity';
import { ChatGateway } from './modules/chat/chat.gateway';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Contact } from './modules/contact/contact.entity';
import { ContactModule } from './modules/contact/contact.module';
import { WsGuard } from './modules/auth/ws.guard';

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot(), 
    ConversationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'messenger',
      entities: [User, Conversation, Contact]
    }),
    AuthModule,
    UserModule,
    ContactModule,
    MulterModule.register({
      dest: './files',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'files'),
      serveStaticOptions: {
        fallthrough: false
      },
      serveRoot: '/files'
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, WsGuard],
})
export class AppModule {}
