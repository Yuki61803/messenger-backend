export interface TextMessage {
    author_id: string | number,
    text: string,
    type: 'text',
    readed_by: string[]
    status: 'default' | 'changed',
    created_at: string | number, // unix timestamp
    updated_at: string | number, // unix timestamp
}