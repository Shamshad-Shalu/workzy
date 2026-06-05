import { buildRoute } from './routeBuilder';

const messages = buildRoute('/messages');

export const MESSAGE_API = {
  GET_MESSAGES: (chatId: string) => messages(`/${chatId}`),
};
