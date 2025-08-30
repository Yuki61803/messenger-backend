
import { Body, Controller, Post, Get, HttpCode, Request, HttpStatus, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Response() res) {
    const tokenObject = await this.authService.signIn(signInDto.name, signInDto.password);

    res.cookie('access_token', tokenObject.access_token);

    res.send(tokenObject);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}