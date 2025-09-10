export type ValidationPaneStyle = 'danger' | 'warning' | 'success' | 'magic' | 'info' | 'default'

export default interface ValidationPaneMessage {
    id: string,
    content: string,
    timestamp?: number,
    isDismissable?: boolean,
    type: ValidationPaneStyle;
}