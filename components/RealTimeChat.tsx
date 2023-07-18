'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import useText2Speech from '@/hooks/useText2Speech';
import { extractLangAndClean, getLang } from '@/utils/lang';
import { useCallback, useEffect, useState } from 'react';

export default function RealTimeChat() {
  const { messageLog, systemSay, userSay, assistantSay } = useMessageLog();

  const [currentLang, setCurrentLang] = useState('en-US');
  const { completion, getCompletionStream } = useChatCompletion();
  const { speak, stop: stopText2Speech, isSpeeching } = useText2Speech();

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
      // vmsPlay(realCompletion);
      await speak(realCompletion, {
        lang: computedLang || currentLang,
      });
    },
    [assistantSay, currentLang, getCompletionStream, speak, userSay],
  );

  useEffect(() => {
    systemSay(
      '1.你作为一个人工智能助手，解决用户的各种问题；2.用户使用哪种语言提问你就使用对应语言回答，除非用户让你使用特定语言回答；3.每次响应最前面返回当前语言对应的 BCP 47 语言标签规范的lang，比如zh-CN、en-US，用<lang>标签包裹lang，之后是响应内容，示例：<lang>zh-CN</lang>中文响应',
    );
    getCompletionAndSpeak('hello');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemSay]);

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

  return (
    <>
      <div className={`fixed inset-0 z-10 p-4 overflow-y-auto`}>
        <h2 className="font-bold mb-1">语音识别</h2>
        <p>isTranscribing: {String(isTranscribing)}</p>
        <p className="text-blue-500">{recognizeText}</p>
        <h2 className="font-bold mb-1">chatgpt补全</h2>
        <p className="text-blue-500">{completion?.content}</p>
        <h2 className="font-bold mb-1">语音合成</h2>
        <p>isSpeeching: {String(isSpeeching)}</p>

        <div className="mt-5 flex space-x-4">
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => startSpeech2text()}
          >
            start
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => {
              stopSpeech2text();
              stopText2Speech();
            }}
          >
            stop
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => {
              getCompletionAndSpeak('hello');
            }}
          >
            Hello
          </button>
        </div>

        <h2 className="text-2xl font-bold my-4">历史</h2>
        <ul>
          {[...messageLog.slice(1)].reverse().map((message) => (
            <li key={message.created} className="mb-2">
              <span className="font-bold">{message.role}: </span>
              <span>{message.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
