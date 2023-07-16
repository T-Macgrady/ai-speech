'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';

const fillPrompt = (prompt) =>
  `将英文翻译为中文，要求语法准确，语句通顺，语气自然，直接返回翻译结果：${prompt}`;

const SimultaneousInterpretation = () => {
  const { messageLog, userSay, assistantSay, reset } = useMessageLog();
  const { getCompletion } = useChatCompletion();
  const {
    text: recognizeText,
    start: startSpeech2Text,
    stop: stopSpeech2Text,
  } = useSpeech2Text({
    lang: 'en-US',
    onRecognizeEnd: async (text) => {
      if (!text) return;

      userSay(text);

      const completion = await getCompletion(fillPrompt(text));

      completion?.content &&
        assistantSay(completion.content, completion.created);
    },
  });
  const { completion: realTimeCompletion } = useChatCompletion({
    prompt: recognizeText ? fillPrompt(recognizeText) : '',
  });

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
      <div className="mb-4">
        <span className="mr-2">Real-time input:</span>
        <span className="text-blue-500">{recognizeText}</span>
        <br />
        <span className="mr-2">Real-time completion:</span>
        <span className="text-blue-500">{realTimeCompletion?.content}</span>
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
