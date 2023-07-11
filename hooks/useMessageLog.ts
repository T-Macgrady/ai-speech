/**
 * @file useMessageLog.ts
 * @description openai message log hook.
 * @version 0.1.0
 */

import { useMemo, useRef, useState } from 'react';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content?: string;
  name?: string;
  created?: number | string;
};

const filterMessageByRole = (messageLog: Message[], role: string) =>
  messageLog.filter((message) => message.role === role);
const getLastMessageByRole = (messageLog: Message[], role: string) =>
  filterMessageByRole(messageLog, role).pop();

export function useMessageLog() {
  const messageLogRef = useRef<Message[]>([]);
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

  const addMessage = (
    role: Message['role'],
    content: string = '',
    created = +new Date(),
  ) => {
    const newMessage: Message = {
      role,
      content,
      created,
    };
    const newMessageLog = [...messageLog, newMessage];

    setMessageLog((prevMessageLog) => [...prevMessageLog, newMessage]);
    messageLogRef.current = [...messageLogRef.current, newMessage];
    // setMessageLog(newMessageLog);
    console.log('--addMessage--', newMessage, messageLog, newMessageLog);
    return messageLogRef.current;
  };

  const systemSay = (content: string, created: number = +new Date()) => {
    return addMessage('system', content, created);
  };

  const userSay = (content: string = '', created: number = +new Date()) => {
    return addMessage('user', content, created);
  };

  const assistantSay = (
    content: string = '',
    created: number = +new Date(),
  ) => {
    return addMessage('assistant', content, created);
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
