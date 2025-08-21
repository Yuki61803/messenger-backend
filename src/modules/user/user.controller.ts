import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1/order')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getHello(): string {
    return '123';
  }
}
