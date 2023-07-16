'use client';
import { useCallback, useEffect, useState } from 'react';

type ChatCompletionConfig = {
  model?: string;
  messages?: {
    role: 'system' | 'user' | 'assistant';
    content?: string;
    name?: string;
  }[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
};

export function useChatCompletion({
  prompt = '',
  url = 'https://api.chatanywhere.com.cn/v1',
  model = 'gpt-3.5-turbo-16k',
  apikey = 'sk-JaV54rjCdAskBUzHkI7ujNf8qWjANFEc0XmOJTZt3qPWWLAO',
} = {}) {
  const [error, setError] = useState(null);
  const [completion, setCompletion] = useState<{
    content: string;
    created: number;
  }>();

  const getCompletion = useCallback(
    async (
      text: string,
      config?: ChatCompletionConfig,
    ): Promise<{
      content: string;
      created: number;
    } | void> => {
      const reqJson = {
        messages: [
          {
            role: 'user',
            content: text || prompt || '',
          },
        ],
        max_tokens: 2048,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['\n', ' Human:', ' AI:'],
        model: model,
        ...config,
      };
      const response = await fetch(`${url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify(reqJson),
      });
      const data = (await response.json()) || {};
      console.log('--getCompletion-- ', reqJson, data);
      if (data.error) {
        setError(data.error);
        return;
      }
      const content = data?.choices[0]?.message?.content || '';
      const resData = { created: data.created, content };
      setCompletion(resData);
      return resData;
    },
    [prompt, url, apikey, model],
  );

  useEffect(() => {
    if (prompt) {
      getCompletion(prompt);
    }
  }, [prompt, getCompletion]);

  return {
    error,
    completion,
    getCompletion,
  };
}
