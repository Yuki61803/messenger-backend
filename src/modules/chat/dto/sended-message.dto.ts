import { Conversation } from "src/modules/conversation/conversation.entity";
import { FileMessage } from "src/modules/conversation/dto/file-message.dto";
import { TextMessage } from "src/modules/conversation/dto/text-message.dto";

export interface SendedMessage {
    conversation: Conversation,
    message: TextMessage | FileMessage
}