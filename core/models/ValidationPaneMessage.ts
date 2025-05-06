export interface ValidationPaneMessage {
    id: string,
    text: string,
    content: string,
    timestamp: number,
    isDismissable: boolean,
    type: 'danger' | 'warning' | 'success' | 'magic' | 'info' | 'default';
}