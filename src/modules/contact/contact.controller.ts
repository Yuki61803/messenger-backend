import { Controller, Post, Delete, HttpCode, UseGuards, Query, Request, Body, Get } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('/api/v1/contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  @UseGuards(AuthGuard)
  getContacts(@Request() request, @Query() search: {text: string}) {
    if (search?.text?.length > 0)
      return this.contactsService.getContactIds(request.user.id, search.text);
    else
      return this.contactsService.getContactIds(request.user.id);
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
  @HttpCode(200)
  @UseGuards(AuthGuard)
  favoriteContact(@Request() request, @Body() contactDto: {contact_id: string | number}) {
    this.contactsService.favoriteContact(request.user.id, contactDto.contact_id);

  }

  @Post('/block')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  blockContact(@Request() request, @Body() contactDto: {contact_id: string | number}) {
    this.contactsService.blockContact(request.user.id, contactDto.contact_id);

  }
}
