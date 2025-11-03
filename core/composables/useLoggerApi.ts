import { useApiGateway } from './useApiGateway';
import { useHost, useMeta } from '../plugins/host';

export type LogLevel = 'info' | 'warn' | 'error';

interface LoggerPayload {
  level: LogLevel;
  appName: string;
  message: string;
  meta: {
    transactionId: string;
    projectId: string;
    designId: string;
    user: string;
  };
  data?: any;
}

export function getLoggerPayload(
  level: LogLevel,
  message: string,
  transactionId: string,
  data?: any
): LoggerPayload {
  const designId = useHost().configuration.id;
  const meta = useMeta();

  return {
    level,
    message,
    appName: meta.configurator.name,
    meta: {
      transactionId,
      projectId: meta.project.id,
      designId: designId,
      user: meta.user.email,
    },
    data,
  };
}

export default function useLoggerApi() {
  const api = useApiGateway('logger');

  return {
    async sendMessage(level: LogLevel, message: string, transactionId: string, payload: any) {
      const data = getLoggerPayload(level, message, transactionId, payload);

      return api.post(data);
    }

  }
}
