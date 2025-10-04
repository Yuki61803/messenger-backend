export interface SendMessage {
    type: 'text' | 'file',
    conversation_id: string | number,
    text: string,
    file_urls?: string[],
    contact_id?: string
}
