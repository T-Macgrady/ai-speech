/**
 * @file useMessageLog.ts
 * @description openai message log hook.
 * @version 0.1.0
 */

import { useMemo, useState } from 'react';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content?: string;
  name?: string;
};

const filterMessageByRole = (messageLog: Message[], role: string) =>
  messageLog.filter((message) => message.role === role);
const getLastMessageByRole = (messageLog: Message[], role: string) =>
  filterMessageByRole(messageLog, role).pop();

export function useMessageLog() {
  const [messageLog, setMessageLog] = useState<Message[]>([]);
  const messageLength = messageLog.length;
  const lastUserMessage = useMemo(
    () => getLastMessageByRole(messageLog, 'user')?.content,
    [messageLog],
  );
  const lastAssistantMessage = useMemo(
    () => getLastMessageByRole(messageLog, 'assistant')?.content,
    [messageLog],
  );

  const addMessage = (role: Message['role'], content: string = '') => {
    const newMessage: Message = {
      role,
      content,
    };
    const newMessageLog = [...messageLog, newMessage];
    setMessageLog(newMessageLog);
    // log
    console.log('--addMessage--', newMessage, messageLog, newMessageLog);
    return newMessageLog;
  };

  const systemSay = (content: string) => {
    return addMessage('system', content);
  };

  const userSay = (content: string = '') => {
    return addMessage('user', content);
  };

  const assistantSay = (content: string = '') => {
    return addMessage('assistant', content);
  };

  return {
    messageLength,
    lastUserMessage,
    lastAssistantMessage,
    messageLog,
    systemSay,
    userSay,
    assistantSay,
  };
}
