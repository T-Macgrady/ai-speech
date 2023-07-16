'use client';
import { useCallback, useRef, useState } from 'react';

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
  const [messageLog, setMessageLog] = useState<Message[]>(
    messageLogRef.current,
  );

  const addMessage = useCallback(
    (role: Message['role'], content = '', created = +new Date()) => {
      const newMessage: Message = {
        role,
        content,
        created,
      };
      messageLogRef.current = [...messageLogRef.current, newMessage];
      setMessageLog(messageLogRef.current);

      console.table(newMessage);

      return messageLogRef.current;
    },
    [],
  );

  const systemSay = useCallback(
    (content: string, created: number = +new Date()) => {
      return addMessage('system', content, created);
    },
    [addMessage],
  );

  const userSay = useCallback(
    (content = '', created: number = +new Date()) => {
      return addMessage('user', content, created);
    },
    [addMessage],
  );

  const assistantSay = useCallback(
    (content = '', created: number = +new Date()) => {
      return addMessage('assistant', content, created);
    },
    [addMessage],
  );

  const reset = useCallback(() => {
    messageLogRef.current = [];
    setMessageLog(messageLogRef.current);
  }, []);

  return {
    lastUserMessage: getLastMessageByRole(messageLog, 'user')?.content,
    lastAssistantMessage: getLastMessageByRole(messageLog, 'assistant')
      ?.content,
    messageLog,
    systemSay,
    userSay,
    assistantSay,
    reset,
  };
}
