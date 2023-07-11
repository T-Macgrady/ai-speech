'use client';
import { useWhisper } from '@tmacc/use-speech-to-text';
import { useEffect, useState } from 'react';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useText2Speech from '@/hooks/useText2Speech';
import useSpeech2Text from '@/hooks/useSpeech2Text';
// import { useSpeaking } from '@/hooks/useSpeaking';
import ClientOnly from './ClientOnly';

export default function RealTimeChat() {
  const {
    messageLog,
    lastUserMessage,
    lastAssistantMessage,
    systemSay,
    userSay,
    assistantSay,
  } = useMessageLog();

  const [currentLang, setCurrentLang] = useState('en-US');
  const [completion, setCompletion] = useState('');
  const { getCompletion } = useChatCompletion();
  const { speak, isSpeeching } = useText2Speech();

  useEffect(() => {
    systemSay(
      '1.你作为一个人工智能助手，解决用户的各种问题；2.用户使用哪种语言提问你就使用对应语言回答，除非用户让你使用特定语言回答；3.每次响应最前面返回当前语言对应的 BCP 47 语言标签规范的lang，比如zh-CN、en-US，用<lang>标签包裹lang，之后是响应内容，示例：<lang>zh-CN</lang>中文响应',
    );
    // init();
  }, []);

  const {
    isTranscribing,
    text: recognizeText,
    start: startSpeech2text,
    stop: stopSpeech2text,
    abort: abortSpeech2text,
  } = useSpeech2Text({
    async onRecognize(e) {
      console.log('onRecognize', e);
      if (!e.isFinal || !e.value) return;
      // stopSpeech2text();
      const text = e.value;
      const newMessages = userSay(text);
      console.error('userSay-----', text, newMessages, messageLog);
      const completionObj = await getCompletion(text, {
        model: 'gpt-3.5-turbo-16k',
        messages: newMessages,
      });
      if (!completionObj) return;
      const { content: completion, created } = completionObj;
      const { lang, text: realCompletion } = extractLangAndClean(completion);
      assistantSay(realCompletion, created);
      setCompletion(realCompletion);
      console.error('assistantSay-----', realCompletion);

      await speak(realCompletion, {
        lang: lang || currentLang,
      });
      lang && setCurrentLang(lang);
      console.log('--speak-end----');
      // startSpeech2text();
      // init();
      // setTimeout(() => {
      //   restart();
      // }, 3000);
    },
    // async onEnd(e) {
    //   console.log('onEnd', e);

    //   // startSpeech2text();
    // },
  });

  // const { isSpeaking, restart, reset, init } = useSpeaking({
  //   onSpeaking(speaking) {
  //     console.log('--onspeaking--', speaking, isSpeeching, isTranscribing);
  //     if (speaking) {
  //       console.error('--startSpeech2text--');
  //       // reset();
  //       // startSpeech2text();
  //     }
  //     // if (speaking && !isTranscribing && !isSpeeching) {
  //     //   startSpeech2text();
  //     //   console.error('--startSpeech2text--');
  //     // }
  //   },
  // });

  useEffect(() => {
    console.log('--useEffect--', isTranscribing, isSpeeching);
    // if (isSpeaking) return;
    // setTimeout(() => {
    // if (!isTranscribing && !isSpeeching) {
    //   init();
    //   console.error('--init--');
    // }
    // }, 1000);
    // } else {
    //   console.log('--reset--');
    //   reset();
    // }
  }, [isTranscribing, isSpeeching]);

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
    whisperConfig: {
      language: '',
    },
    onSpeakingCallback: (isSpeaking: boolean) => {
      console.log(
        'onSpeakingCallback',
        isSpeaking,
        recording,
        speaking,
        transcribing,
      );
      if (!isSpeaking) return;

      if (!recording && !speaking && !transcribing) {
        startRecording();
        console.log('--startRecording--');
      }
    },
    onWhisperedCallback: async (text: string) => {
      if (
        !text ||
        ['Thanks for watching!', 'Thank you for watching!', 'You'].includes(
          text,
        )
      )
        return;
      const newMessages = userSay(text);
      console.error('userSay-----', text, newMessages, messageLog);
      const completionObj = await getCompletion(text, {
        model: 'gpt-3.5-turbo-16k',
        messages: newMessages,
      });
      if (!completionObj) return;
      const { content: completion, created } = completionObj;
      const { lang, text: realCompletion } = extractLangAndClean(completion);
      assistantSay(realCompletion, created);
      setCompletion(realCompletion);
      console.error('assistantSay-----', realCompletion);

      await speak(realCompletion, {
        lang: lang || currentLang,
      });
      lang && setCurrentLang(lang);
      console.log('--speak-end----');

      // if (!recording && !speaking && !transcribing) {
      //   startRecording();
      //   console.log('--startRecording--');
      // }
    },
  });

  return (
    <ClientOnly>
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>转录</h2>
        <p>Recording: {String(recording)}</p>
        <p>Speaking: {String(speaking)}</p>
        <p>Transcribing: {String(transcribing)}</p>
        <p>Transcribed Text: {transcript.text}</p>
        <p>lastUserMessage Text: {lastUserMessage}</p>
        {/* <p>isSpeaking: {String(isSpeaking)}</p> */}
        <p>isSpeeching: {String(isSpeeching)}</p>
        <p>isTranscribing: {String(isTranscribing)}</p>
        <p>recognizeText Text: {recognizeText}</p>
        <div className='flex space-x-4'>
          <button
            className='mb-5 bg-blue-500 text-white py-2 px-4 rounded'
            onClick={() => startRecording()}
          >
            start
          </button>
          <button
            className='mb-5 bg-blue-500 text-white py-2 px-4 rounded'
            onClick={() => pauseRecording()}
          >
            Pause
          </button>
          <button
            className='mb-5 bg-blue-500 text-white py-2 px-4 rounded'
            onClick={() => stopRecording()}
          >
            Stop
          </button>
        </div>
        <h1>speech2text</h1>
        <div className='flex space-x-4'>
          <button
            className='mb-5 bg-blue-500 text-white py-2 px-4 rounded'
            onClick={() => startSpeech2text()}
          >
            start
          </button>
          <button
            className='mb-5 bg-blue-500 text-white py-2 px-4 rounded'
            onClick={() => stopSpeech2text()}
          >
            stop
          </button>
          <button
            className='bg-blue-500 text-white py-2 px-4 rounded'
            // onClick={() => speak('你好，你叫什么名字，你住在哪里，你是谁，吃饭了吗')}
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance('hello yoyo');
              console.log('utterance', utterance);
              window.speechSynthesis.speak(utterance);
            }}
          >
            Speak
          </button>
        </div>
        <h2 className='text-2xl font-bold my-4'>响应</h2>
        <p>complete: {completion}</p>
        <p>lastAssistantMessage: {lastAssistantMessage}</p>
        <h2 className='text-2xl font-bold my-4'>对话历史</h2>
        <ul>
          {messageLog.map((message, index) => (
            <li key={message.created} className='mb-2'>
              <span className='font-bold'>{message.role}: </span>
              <span>{message.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </ClientOnly>
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
    lang: '',
    text,
  };
}
