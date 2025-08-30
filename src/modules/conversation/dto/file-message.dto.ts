export interface FileMessage {
    author_id: string | number,
    text: string,
    file_urls: string[],
    type: 'file',
    readed_by: string[]
    status: 'default' | 'changed',
    created_at: string | number, // unix timestamp
    updated_at: string | number, // unix timestamp
}