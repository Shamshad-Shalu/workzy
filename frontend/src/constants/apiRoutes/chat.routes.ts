import { buildRoute } from './routeBuilder';

const chat = buildRoute('/chats');

export const CHAT_API = {
  GET_CHAT_ROOMS: chat('/rooms'),
  GET_ROOM_BY_ID: (chatId: string) => chat(`/room/${chatId}`),
  CREATE_ROOM: chat('/room'),
};
