'use client';
import { useWhisper } from '../../use-whisper/lib/index.js';
import { useEffect, useState } from 'react';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';

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

  const onWhisperedCallback = async (text: string) => {
    const newMessages = userSay(text);
    userSay(text);
    const complete = await getCompletion(text, {
      model: 'gpt-3.5-turbo-16k',
      messages: newMessages,
    });
    assistantSay(complete);
    setCompletion(complete);
    console.log('onWhisperedCallback', text, complete);
  };

  useEffect(() => {
    systemSay('hello~');
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
