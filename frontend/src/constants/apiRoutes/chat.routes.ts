import { buildRoute } from './routeBuilder';

const chat = buildRoute('/chats');

export const CHAT_API = {
  GET_CHATS: chat('/rooms'),
  BY_ID: (chatId: string) => chat(`/room/${chatId}`),
  CREATE: chat('/room'),
};
