'use client';
import { useWhisper } from '../../use-whisper/lib/index.js';
import { useEffect, useState } from 'react';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useText2Speech from '@/hooks/useText2Speech';

export default function RealTimeChat() {
  const {
    messageLog,
    lastUserMessage,
    lastAssistantMessage,
    systemSay,
    userSay,
    assistantSay,
  } = useMessageLog();

  const [completion, setCompletion] = useState('');
  const { getCompletion } = useChatCompletion();
  const { speak } = useText2Speech();

  const onWhisperedCallback = async (text: string) => {
    const newMessages = userSay(text);
    userSay(text);
    const complete = await getCompletion(text, {
      model: 'gpt-3.5-turbo-16k',
      messages: newMessages,
    });
    const { lang, text: cleanText } = extractLangAndClean(complete);
    assistantSay(cleanText);
    setCompletion(cleanText);
    speak(cleanText, {
      lang,
    });
    console.log('onWhisperedCallback', text, cleanText);
  };

  useEffect(() => {
    systemSay(
      '1.你作为一个人工智能助手，解决用户的各种问题；2.用户使用哪种语言提问你就使用对应语言回答，除非用户让你使用特定语言回答；3.每次响应最前面返回当前语言对应的 BCP 47 语言标签规范的lang，比如zh-CN、en-US，用<lang>标签包裹lang，之后是响应内容，示例：<lang>zh-CN</lang>中文响应',
    );
  }, []);

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_TOKEN,
    streaming: false,
    autoStart: false,
    removeSilence: false,
    nonStop: true, // keep recording as long as the user is speaking
    stopTimeout: 2000, // auto stop after 2 seconds
    timeSlice: 1000, // 1 second
    whisperConfig: {},
    onWhisperedCallback,
  });

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>转录</h2>
      <p>Recording: {String(recording)}</p>
      <p>Speaking: {String(speaking)}</p>
      <p>Transcribing: {String(transcribing)}</p>
      <p>Transcribed Text: {transcript.text}</p>
      <p>lastUserMessage Text: {lastUserMessage}</p>
      <div className='flex space-x-4'>
        <button
          className='bg-blue-500 text-white py-2 px-4 rounded'
          onClick={() => startRecording()}
        >
          Start
        </button>
        <button
          className='bg-blue-500 text-white py-2 px-4 rounded'
          onClick={() => pauseRecording()}
        >
          Pause
        </button>
        <button
          className='bg-blue-500 text-white py-2 px-4 rounded'
          onClick={() => stopRecording()}
        >
          Stop
        </button>
      </div>
      <h2 className='text-2xl font-bold my-4'>响应</h2>
      <p>complete: {completion}</p>
      <p>lastAssistantMessage: {lastAssistantMessage}</p>
      <h2 className='text-2xl font-bold my-4'>对话历史</h2>
      <ul>
        {messageLog.map((message, index) => (
          <li key={index} className='mb-2'>
            <span className='font-bold'>{message.role}: </span>
            <span>{message.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function extractLangAndClean(text: string): {
  lang: string;
  text: string;
} {
  const regex = /^<lang>(.*?)<\/lang>/;
  const match = regex.exec(text);

  if (match) {
    return {
      lang: match[1],
      text: text.replace(regex, ''),
    };
  }

  return {
    lang: 'en-US',
    text,
  };
}
