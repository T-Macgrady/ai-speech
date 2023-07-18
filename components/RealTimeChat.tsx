'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import useText2Speech from '@/hooks/useText2Speech';
import { extractLangAndClean, getLang } from '@/utils/lang';
import { useCallback, useEffect, useState } from 'react';
import { FaMicrophone, FaSpinner, FaStop } from 'react-icons/fa';

export default function RealTimeChat() {
  const { messageLog, systemSay, userSay, assistantSay } = useMessageLog();

  const {
    isFetching,
    completion: currentCompletion,
    getCompletionStream,
  } = useChatCompletion();
  const { speak, stop: stopText2Speech, isSpeeching } = useText2Speech();

  const [currentLang, setCurrentLang] = useState('en-US');
  const getCompletionAndSpeak = useCallback(
    async (text: string) => {
      const messages = userSay(text);

      // getCompletion
      const completionObj = await getCompletionStream(text, { messages });
      if (!completionObj) return;
      const { content, created } = completionObj;
      const { lang, text: realCompletion } = extractLangAndClean(content);

      assistantSay(realCompletion, created);

      // speak
      const computedLang = lang || getLang(realCompletion);
      computedLang && setCurrentLang(computedLang);
      await speak(realCompletion, {
        lang: computedLang || currentLang,
      });
    },
    [assistantSay, currentLang, getCompletionStream, speak, userSay],
  );

  const {
    isTranscribing,
    text: recognizeText,
    start: startSpeech2text,
    stop: stopSpeech2text,
  } = useSpeech2Text({
    async onRecognizeEnd(text) {
      stopSpeech2text();

      await getCompletionAndSpeak(text);

      startSpeech2text();
    },
  });

  useEffect(() => {
    systemSay(
      '1.你作为一个人工智能助手，解决用户的各种问题；2.用户使用哪种语言提问你就使用对应语言回答，除非用户让你使用特定语言回答；3.每次响应最前面返回当前语言对应的 BCP 47 语言标签规范的lang，比如zh-CN、en-US，用<lang>标签包裹lang，之后是响应内容，示例：<lang>zh-CN</lang>中文响应',
    );
    // getCompletionAndSpeak('hello');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemSay]);

  const handleStart = () => {
    startSpeech2text();
  };

  const handleStop = () => {
    stopSpeech2text();
    stopText2Speech();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen pt-2">
      <div className="md:col-span-2 flex flex-col h-full">
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-center">ChatGPT 语音助手</h1>
            <p className="text-gray-500 text-center mt-2">
              语音输入，AI 回答，让对话更自然
            </p>
          </div>
          <div className="mb-4 flex-grow flex flex-col justify-center items-center">
            <div className="relative">
              <button
                className={`${
                  isTranscribing
                    ? 'bg-red-500'
                    : isSpeeching || isFetching
                    ? 'bg-gray-500'
                    : 'bg-blue-500'
                } hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 ease-in-out`}
                onClick={
                  isTranscribing || isSpeeching || isFetching
                    ? handleStop
                    : handleStart
                }
              >
                {isTranscribing ? (
                  <FaStop className="h-8 w-8" />
                ) : isSpeeching || isFetching ? (
                  <FaSpinner className="h-8 w-8 animate-spin" />
                ) : (
                  <FaMicrophone className="h-8 w-8" />
                )}
              </button>
              {isTranscribing && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 rounded-full w-4 h-4 animate-ping"></div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-center transition-all duration-300 ease-in-out">
                {isTranscribing ? (
                  <span className="text-blue-500 font-bold">
                    正在识别中，点击停止
                  </span>
                ) : isSpeeching || isFetching ? (
                  <span className="text-blue-500 font-bold">
                    正在回答，点击停止
                  </span>
                ) : (
                  <span className="text-blue-500 font-bold">点击开始录音</span>
                )}
              </p>
              <p className="text-blue-500 text-center mt-2">{recognizeText}</p>
            </div>
          </div>
          <div className="mb-4 flex-grow flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-2">AI</h2>
            <div className="flex flex-col w-full max-w-lg bg-white rounded shadow-lg overflow-y-auto transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="p-4">
                {currentCompletion?.content ? (
                  <div className="text-blue-500 font-bold">
                    {currentCompletion.content}
                  </div>
                ) : (
                  <div className="text-gray-500 font-bold"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-1 bg-gray-100 py-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-center">历史记录</h2>

        <ul className="w-full max-w-lg border rounded-lg overflow-hidden divide-y divide-gray-300">
          {messageLog.length > 1 ? (
            [...messageLog.slice(1)].reverse().map((message) => (
              <li
                key={message.created}
                className="px-4 py-2 last:border-0 flex items-center transition-all duration-300 ease-in-out"
              >
                <span
                  className={`${
                    message.role === 'user' ? 'text-blue-500' : 'text-gray-500'
                  } font-bold mr-2`}
                >
                  {message.role === 'user' ? 'U：' : 'AI：'}
                </span>
                <span className="flex-grow">{message.content}</span>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center p-4">
              <p className="text-gray-500 text-center ml-2">暂无</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
