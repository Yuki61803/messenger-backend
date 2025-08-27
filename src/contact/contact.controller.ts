import { Controller, Post, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/v1/contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Post()
  @UseGuards(AuthGuard)
  createContact(@Request() request, @Body() contactDto: {contact_id: string | number}) {
    this.contactsService.createContact(request.user.id, contactDto.contact_id)
  }
  @Delete()
  @UseGuards(AuthGuard)
  deleteContact(@Request() request, @Body() contactDto: {contact_id: string | number}) {
    this.contactsService.deleteContact(request.user.id, contactDto.contact_id)
  }
}
