import type { ChatMessage } from '@/types/chatMessage';
import { formatChatDate } from '@/utils/time.format';

export type FlatItem = { type: 'label'; label: string } | { type: 'message'; data: ChatMessage };

export function buildFlatList(messages: ChatMessage[]): FlatItem[] {
  const result: FlatItem[] = [];
  const groups: { label: string; messages: ChatMessage[] }[] = [];

  for (const msg of messages) {
    const label = formatChatDate(msg.createdAt, 'label');
    const last = groups[groups.length - 1];
    if (!last || last.label !== label) {
      groups.push({ label, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  }

  for (const g of groups) {
    result.push({ type: 'label', label: g.label });
    for (const m of g.messages) {
      result.push({ type: 'message', data: m });
    }
  }

  return result;
}
