'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import { useCallback, useEffect, useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const fillPromptENtoCN = (prompt) =>
  `将英文翻译为中文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const fillPromptCNtoEN = (prompt) =>
  `将中文翻译为英文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const SimultaneousInterpretation = () => {
  const [lang, setLang] = useState('en-CN');
  const { messageLog, userSay, assistantSay, reset } = useMessageLog();
  const { getCompletionStream } = useChatCompletion();

  useEffect(() => {
    const welcomeMessage =
      'Hello, I am your assistant. Please speak, and I will translate.';
    getCompletionAndSay(welcomeMessage);
  }, []);

  const fillPrompt = lang === 'en-CN' ? fillPromptENtoCN : fillPromptCNtoEN;
  const getCompletionAndSay = useCallback(
    async (text) => {
      userSay(text);
      const res = await getCompletionStream(fillPrompt(text));
      res?.content && assistantSay(res.content, res.created);
    },
    [userSay, getCompletionStream, fillPrompt, assistantSay],
  );

  const {
    text: currentText,
    start: startSpeech2Text,
    stop: stopSpeech2Text,
    isTranscribing,
  } = useSpeech2Text({
    lang: lang,
    onRecognizeEnd: async (text) => {
      if (!text) return;
      await getCompletionAndSay(text);
    },
  });

  const toggleLang = () => {
    stopSpeech2Text();
    reset();
    setLang(lang === 'en-CN' ? 'cn-EN' : 'en-CN');
  };

  const { completion: currentCompletion } = useChatCompletion({
    prompt: currentText ? fillPrompt(currentText) : '',
  });

  //原先的代码部分未变，以下仅显示修改的部分

  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-between transition-all duration-300 p-4 ease-in-out space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-green-500 text-xl font-bold">实时转译</div>
        <button
          onClick={toggleLang}
          className="bg-green-200 hover:bg-green-300  text-sm text-gray-800 font-bold p-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
        >
          <FaExchangeAlt className="mr-2" />
          {lang === 'en-CN' ? '英译中' : '中译英'}
        </button>
      </div>
      <section className="mb-4 p-4 max-w-lg w-full bg-white rounded shadow-lg overflow-y-auto transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <h2 className="text-sm font-bold text-gray-900">识别文本</h2>
            {currentText ? (
              <div className="text-blue-500">{currentText}</div>
            ) : (
              <div className="text-gray-500">暂无</div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">转译结果</h2>
            {currentCompletion?.content ? (
              <div className="text-blue-500">{currentCompletion.content}</div>
            ) : (
              <div className="text-gray-500">暂无</div>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col bg-white rounded shadow-lg overflow-y-auto mx-auto my-4 p-4 pt-0 max-w-lg w-full transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="sticky top-0 bg-white py-2 z-10">
          <div className="text-green-500 text-xl font-bold">转译历史</div>
        </div>
        {[...messageLog].reverse().map((message, index) => (
          <div
            key={index}
            className={`py-2 px-4 my-2 rounded border-l-4 ${
              message.role === 'user'
                ? 'border-blue-500 bg-blue-100'
                : 'border-green-500 bg-green-100'
            }`}
          >
            {message.content}
          </div>
        ))}
      </section>
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={isTranscribing ? stopSpeech2Text : startSpeech2Text}
          className={`w-48 h-10 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-110 text-white font-bold ${
            isTranscribing
              ? 'bg-red-500 hover:bg-red-700'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {isTranscribing ? '停止' : '开始'}
        </button>
      </div>
    </div>
  );
};

export default SimultaneousInterpretation;
