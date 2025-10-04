import { FileMessage } from "./file-message.dto";
import { TextMessage } from "./text-message.dto";

export interface ConversationOverview {
    id: string | number,
    messagesToRead: number,
    lastMessage: TextMessage | FileMessage
}
