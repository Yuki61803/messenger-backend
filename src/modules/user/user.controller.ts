import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/user')
  async getUser(@Query() query) {
    return this.usersService.findOneById(query.id);
  }

  @Get('/users')
  async getUsers(@Query() query) {
    let ids = [];
    try {
      ids = JSON.parse(query.ids);
    } catch (err) {
      return {
        message: 'cannot parse ids'
      };
    }
    
    return this.usersService.findManyById(ids);
  }
}
