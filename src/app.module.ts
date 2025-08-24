import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './modules/conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Conversation } from './modules/conversation/conversation.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    ConversationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'messenger',
      entities: [User, Conversation]
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
