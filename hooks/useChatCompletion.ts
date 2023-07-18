'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseChatCompletionConfig = {
  url?: string;
  apikey?: string;
};

type ChatCompletionConfig = {
  prompt?: string;
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
  stream?: boolean;
};

const defaultConfig: ChatCompletionConfig = {
  prompt: '',
  model: 'gpt-3.5-turbo-16k',
  messages: [],
  max_tokens: 10000,
  temperature: 0.5,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  // stop: ['\n', ' Human:', ' AI:'],
  stream: false,
};
const defaultUseConfig: UseChatCompletionConfig = {
  url: 'https://api.chatanywhere.cn/v1',
  apikey: 'sk-JaV54rjCdAskBUzHkI7ujNf8qWjANFEc0XmOJTZt3qPWWLAO',
};

export function useChatCompletion(config = {}, useConfig = {}) {
  const { url, apikey } = { ...defaultUseConfig, ...useConfig };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { prompt, ...initConfig } = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );
  const [isFetching, setIsFetching] = useState(false);
  const [completion, setCompletion] = useState<{
    content: string;
    created: number;
  }>({ content: '', created: -1 });
  const completionStream = useRef<{
    content: string;
    created: number;
  }>({ content: '', created: -1 });

  const getCompletion = useCallback(
    async (
      _prompt: string,
      _config?: ChatCompletionConfig,
    ): Promise<{
      content: string;
      created: number;
    } | void> => {
      const reqJson = {
        ...initConfig,
        messages: [
          {
            role: 'user',
            content: prompt || _prompt || '',
          },
        ],
        ..._config,
      };
      setIsFetching(true);
      try {
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

        const content = data?.choices[0]?.message?.content || '';
        const resData = { created: data.created, content };
        setCompletion(resData);
        return resData;
      } catch (error) {
        console.log('--getCompletion-error-- ', error);
      } finally {
        setIsFetching(false);
      }
    },
    [prompt, url, apikey, initConfig],
  );

  const getCompletionStream = useCallback(
    async (
      _prompt: string,
      _config?: ChatCompletionConfig,
    ): Promise<{
      content: string;
      created: number;
    } | void> => {
      const reqJson = {
        ...initConfig,
        messages: [
          {
            role: 'user',
            content: prompt || _prompt || '',
          },
        ],
        ..._config,

        stream: true,
      };
      setIsFetching(true);
      const response = await fetch(`${url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify(reqJson),
      });

      if (!response.body) return;

      try {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let partialChunk = '';
        let chunk = '';
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            chunk = decoder.decode(value, { stream: true });

            partialChunk += chunk;
            const lines = partialChunk.split('\n');
            partialChunk = lines.pop() || '';
            lines.forEach((line, index) => {
              if (line.includes('[DONE]')) {
                console.log('--getCompletionStream-DONE-- ');
                return;
              }
              // parse line
              let data;
              if (line.startsWith('data: ')) {
                line = line.slice(6); // remove "data: " from the string
              }
              try {
                data = JSON.parse(line);
              } catch (error) {
                if (index === lines.length - 1) {
                  // If this is the last line, append it to the partialChunk
                  // and will wait for the next chunk to complete the JSON string
                  partialChunk = line + '\n';
                }
                return;
              }

              const content = data?.choices[0]?.delta?.content || '';

              completionStream.current = {
                ...completionStream.current,
                created: data.created,
                content: `${completionStream.current?.content || ''}${content}`,
              };
              setCompletion(completionStream.current);
            });
          }
        }

        return { ...completionStream.current };
      } catch (error) {
        console.error('--getCompletionStream-error-- ', error);
      } finally {
        setIsFetching(false);
        completionStream.current = {
          content: '',
          created: -1,
        };
      }
    },
    [initConfig, prompt, url, apikey, completionStream],
  );

  useEffect(() => {
    if (prompt) {
      initConfig.stream ? getCompletionStream(prompt) : getCompletion(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, initConfig.stream]);

  return {
    isFetching,
    completion,
    getCompletion,
    getCompletionStream,
  };
}
