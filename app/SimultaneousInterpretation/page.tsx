'use client';
import CurrentConversation from '@/components/CurrentConversation';
import MessageLog from '@/components/MessageLog';
import RecordButton from '@/components/RecordButton';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const fillPromptENtoCN = (prompt) =>
  `将英文翻译为中文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const fillPromptCNtoEN = (prompt) =>
  `将中文翻译为英文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const SimultaneousInterpretation = () => {
  const [lang, setLang] = useState('en-CN');
  const { messageLog, userSay, assistantSay, reset } = useMessageLog();
  const { isFetching, getCompletionStream } = useChatCompletion();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen pt-2">
      <div
        className={`flex flex-col h-full ${
          messageLog.length > 1 ? 'md:col-span-2' : 'md:col-span-3'
        }`}
      >
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-center">ChatGPT 中英同传</h1>
            <p className="text-gray-500 text-center mt-2">
              语音输入，AI 翻译，让同传更自然
            </p>
          </div>

          {/* toggle */}
          <button
            onClick={toggleLang}
            className="mb-4 bg-green-200 hover:bg-green-300  text-sm text-gray-800 font-bold p-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
          >
            <FaExchangeAlt className="mr-2" />
            {lang === 'en-CN' ? '英译中' : '中译英'}
          </button>

          {/* Button */}
          <div
            className={classNames(
              'mb-4 flex-grow flex flex-col justify-center items-center transition-all duration-300 ease-in-out',
              {
                'scale-150 translate-y-16':
                  !currentText && messageLog.length <= 1,
              },
            )}
          >
            <RecordButton
              isTranscribing={isTranscribing}
              // isSpeeching={isSpeeching}
              isFetching={isFetching}
              onStart={startSpeech2Text}
              onStop={stopSpeech2Text}
            />
          </div>

          {currentText && (
            <CurrentConversation
              currentCompletion={currentCompletion}
              recognizeText={currentText}
            />
          )}
        </div>
      </div>

      {/* history */}
      <MessageLog messageLog={messageLog} />
    </div>
  );
};

export default SimultaneousInterpretation;
