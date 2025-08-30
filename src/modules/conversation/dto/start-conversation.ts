import { IsString } from "class-validator";

export class StartConversationDto {
    @IsString()
    user_id: string;

    @IsString()
    message: string;
}