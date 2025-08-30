import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Contact } from 'src/modules/contact/contact.entity';
import { ContactModule } from 'src/modules/contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Contact])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}