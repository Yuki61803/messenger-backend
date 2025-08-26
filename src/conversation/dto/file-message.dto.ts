export interface FileMessage {
    author_id: string | number,
    text: string,
    file_url: string,
    type: 'file',
    readed_by: string[]
    status: 'default' | 'changed'
}