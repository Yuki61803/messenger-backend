import { Controller, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('/api/v1/order')
export class ContactController {
  constructor(private readonly appService: ContactService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
