import { Controller, Post, Delete, UseGuards, Request, Body, Get } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('/api/v1/contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  @UseGuards(AuthGuard)
  getContacts(@Request() request) {
    return this.contactsService.getContactIds(request.user.id)
  }
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

  @Post('/favorite')
  @UseGuards(AuthGuard)
  favoriteContact(@Request() request, @Body() contactDto: {contact_id: string | number}) {
    this.contactsService.favoriteContact(request.user.id, contactDto.contact_id)
  }
}
