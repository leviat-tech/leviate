export default interface ValidationPaneMessage {
    id: string,
    content: string,
    timestamp: number,
    isDismissable: boolean,
    type: 'danger' | 'warning' | 'success' | 'magic' | 'info' | 'default';
}