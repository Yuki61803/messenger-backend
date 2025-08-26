import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;
}