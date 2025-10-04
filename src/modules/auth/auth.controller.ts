
import { Body, Controller, Post, Get, HttpCode, Request, HttpStatus, Response, UseGuards, Patch } from '@nestjs/common';
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

  @HttpCode(HttpStatus.OK)
  @Post('login/b24')
  async signInViaB24(@Body() signInDto: Record<string, any>, @Response() res) {
    const tokenObject = await this.authService.authViaB24(signInDto.token, signInDto.memberId);

    res.cookie('access_token', tokenObject.access_token);

    res.send(tokenObject);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/test')
  async signInTest(@Body() signInDto: Record<string, any>, @Response() res) {
    const tokenObject = await this.authService.authViaB24Test(signInDto);

    res.cookie('access_token', tokenObject.access_token);

    res.send(tokenObject);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
