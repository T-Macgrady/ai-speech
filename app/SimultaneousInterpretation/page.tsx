'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import { useCallback, useEffect } from 'react';

const fillPrompt = (prompt) =>
  `将英文翻译为中文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const SimultaneousInterpretation = () => {
  const { messageLog, userSay, assistantSay, reset } = useMessageLog();
  const { completion, getCompletionStream } = useChatCompletion();
  const getCompletionAndSay = useCallback(
    async (text) => {
      userSay(text);

      const res = await getCompletionStream(fillPrompt(text));

      res?.content && assistantSay(res.content, res.created);
    },
    [assistantSay, getCompletionStream, userSay],
  );

  const {
    text: recognizeText,
    start: startSpeech2Text,
    stop: stopSpeech2Text,
  } = useSpeech2Text({
    lang: 'en-US',
    onRecognizeEnd: async (text) => {
      if (!text) return;

      getCompletionAndSay(text);
    },
  });
  const { completion: realTimeCompletion } = useChatCompletion({
    prompt: recognizeText ? fillPrompt(recognizeText) : '',
  });

  const hello = useCallback(() => {
    getCompletionAndSay(
      'Hello，I am a simultaneous interpretation system. You can speak English and I will translate it into Chinese. Let us try it.',
    );
  }, [getCompletionAndSay]);

  useEffect(() => {
    hello();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-2 h-screen">
      <h1 className="font-bold mb-4 text-center">
        Simultaneous Interpretation- EN2ZH
      </h1>
      <div
        onClick={startSpeech2Text}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-block"
      >
        Start
      </div>
      <div
        onClick={stopSpeech2Text}
        className="ml-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-block"
      >
        Stop
      </div>
      <div
        onClick={() => {
          stopSpeech2Text();
          startSpeech2Text();
        }}
        className="ml-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-block"
      >
        ReStart
      </div>
      <div
        onClick={reset}
        className="ml-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-block"
      >
        Clear
      </div>
      <div
        onClick={hello}
        className="ml-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-block"
      >
        Hello
      </div>
      <div className="mb-4">
        <span className="mr-2">Real-time input:</span>
        <span className="text-blue-500">{recognizeText}</span>
        <br />
        <span className="mr-2">Real-time completion:</span>
        <span className="text-blue-500">{realTimeCompletion?.content}</span>
        <br />
        <span className="mr-2">completion:</span>
        <span className="text-blue-500">{completion?.content}</span>
      </div>
      <h1 className="font-bold mb-4">Result</h1>
      {/* <p className=" text-orange-500 mb-2">
        {messageLog
          .filter((m) => m.role === 'assistant')
          .map((m) => m.content)
          .join('；')}
      </p> */}
      <ul>
        {[...messageLog].reverse().map((message) => {
          return (
            <li key={message.created} className="mb-1 first:text-red-500">
              <span className="font-bold">{message.role}</span>:{' '}
              {message.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SimultaneousInterpretation;
