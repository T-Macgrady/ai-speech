'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import useText2Speech from '@/hooks/useText2Speech';
import { extractLangAndClean, getLang } from '@/utils/lang';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import CurrentConversation from './CurrentConversation';
import MessageLog from './MessageLog';
import RecordButton from './RecordButton';

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
      <div
        className={`flex flex-col h-full ${
          messageLog.length > 1 ? 'md:col-span-2' : 'md:col-span-3'
        }`}
      >
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-center">ChatGPT 语音助手</h1>
            <p className="text-gray-500 text-center mt-2">
              语音输入，AI 回答，让对话更自然
            </p>
          </div>
          <div
            className={classNames(
              'mb-4 flex-grow flex flex-col justify-center items-center transition-all duration-300 ease-in-out',
              {
                'scale-150 translate-y-16':
                  !recognizeText && messageLog.length <= 1,
              },
            )}
          >
            <RecordButton
              isTranscribing={isTranscribing}
              isSpeeching={isSpeeching}
              isFetching={isFetching}
              onStart={handleStart}
              onStop={handleStop}
            />
          </div>
          {recognizeText && (
            <CurrentConversation
              currentCompletion={currentCompletion}
              recognizeText={recognizeText}
            />
          )}
        </div>
      </div>

      <MessageLog messageLog={messageLog} />
    </div>
  );
}
