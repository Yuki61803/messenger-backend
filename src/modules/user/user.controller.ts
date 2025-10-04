import { Controller, Get, Request, Query, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('/api/v1')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Patch('/user/status')
  async changeMyStatus(@Request() req, @Body() statusDto: {status: 'online' | 'offline'}) {
    return this.usersService.changeStatus(req.user.id, statusDto.status);
  }

  @Patch('/user/me')
  async changeMyProfile(@Request() req, @Body() user_data: User) {
    return this.usersService.updateOne(req.user.id, user_data);
  }

  @Get('/user')
  async getUser(@Query() query) {
    return this.usersService.findOneById(query.id);
  }

  @Post('/user')
  async createUser(@Body() credentials: {name: string, password: string}) {
    return this.usersService.save({
      name: credentials.name,
      password: credentials.password,
      is_online: false
    });
  }

  @Get('/search')
  async findUser(@Query() query) {
    let users = await this.usersService.findUsers(query?.text);
    console.log(users);

    return users; 
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
