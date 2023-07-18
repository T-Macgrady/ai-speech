'use client';
import { useChatCompletion } from '@/hooks/useChatCompletion';
import { useMessageLog } from '@/hooks/useMessageLog';
import useSpeech2Text from '@/hooks/useSpeech2Text';
import useText2Speech from '@/hooks/useText2Speech';
import VMS from '@/libs/TTS/VMS/xf';
import { extractLangAndClean, getLang } from '@/utils/lang';
import { useWhisper } from '@tmacc/use-speech-to-text';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import VideoPlayer from './Video';

export default function RealTimeChat() {
  const { messageLog, systemSay, userSay, assistantSay } = useMessageLog();

  const [currentLang, setCurrentLang] = useState('en-US');
  const { completion, getCompletionStream } = useChatCompletion();
  const { speak, stop: stopText2Speech, isSpeeching } = useText2Speech();

  const vms = useRef<VMS>();

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
      vmsPlay(realCompletion);
      await speak(realCompletion, {
        lang: computedLang || currentLang,
      });
    },
    [assistantSay, currentLang, getCompletionStream, speak, userSay],
  );

  useEffect(() => {
    // console.log('--useEffect--', clappr, clappr?.Player);
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
    // onEnd(text, e) {
    //   e?.error === 'no-speech' ? startSpeech2text() : stopSpeech2text();
    // },
  });

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

      await getCompletionAndSpeak(text);
    },
  });
  const [vmsVideo, setVmsVideo] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [videoStart, setVideoStart] = useState(false);

  const vmsInit = useCallback(async () => {
    // setVmsVideo('rtmp://srs-pull.xf-yun.com/live/7066803 ');
    // return;
    async function testAI() {
      vms.current = new VMS(); // 创建 AI 类的实例对象，注意替换为你的App ID

      console.log('vms', vms);
      // 开始一次新的会话
      const { stream_url } = await vms.current?.start();
      console.log('stream_url', stream_url);

      const res = await axios.get(
        'https://srs-pull.xf-yun.com/convert?source=' + stream_url,
      );

      console.log('res', res);
      const url = res?.data?.url;

      if (!url) return;

      setVmsVideo(url);
      console.log('url', url);

      setInterval(() => {
        vmsKeeplive();
      }, 30 * 1000);

      // 轮询url直到可以访问
      const timer = setInterval(() => {
        axios
          .get(url)
          .then((res) => {
            console.log('res', res);
            if (res.status === 200) {
              clearInterval(timer);
              console.log('videoReady', true);
              setVideoReady(true);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      }, 500);
    }

    testAI();
  }, [setVideoReady]);

  useEffect(() => {
    // vmsInit();

    return () => {
      vmsStop();
    };
  }, [vmsInit]);

  const vmsPlay = async (text: string) => {
    // setVmsVideo('rtmp://srs-pull.xf-yun.com/live/7066803 ');
    // return;
    async function testAI() {
      // 虚拟人进行说话
      await vms.current?.textDrive(text);

      console.log('textDrive');
      // 虚拟人通过姿态控制进行动作
      // await vms.avatarControl('action', 'A_LH_introduced_O', 7);

      // console.log('avatarControl');
      // 在会话超时之前，发送一次心跳包以维持会话
      // await vms.keepAlive();

      // console.log('keepAlive');
      // 结束会话
      // await vms.stop();
    }

    try {
      testAI();
    } catch (error) {
      console.log('error', error);
    }
  };

  const vmsControl = async () => {
    // setVmsVideo('rtmp://srs-pull.xf-yun.com/live/7066803 ');
    // return;
    async function testAI() {
      // 虚拟人通过姿态控制进行动作
      await vms.current?.avatarControl('action', 'A_LH_introduced_O', 7);

      console.log('avatarControl');
    }
    testAI();
  };

  const vmsKeeplive = async () => {
    async function testAI() {
      // 在会话超时之前，发送一次心跳包以维持会话
      await vms.current?.keepAlive();
      console.log('keepAlive');
    }

    testAI();
  };

  const vmsStop = async () => {
    async function testAI() {
      // 结束会话
      await vms.current?.stop();
    }

    testAI();
  };

  const onVideoStart = useCallback(() => {
    setVideoStart(true);
  }, []);

  return (
    <>
      {/* <VideoPlayer className="fixed inset-0 z-20" url={vmsVideo} /> */}
      {videoReady && (
        <div
          className="fixed inset-0 z-0 op w-screen h-screen transition-opacity duration-1000"
          style={{
            opacity: videoStart ? 1 : 0,
          }}
        >
          <VideoPlayer url={vmsVideo} onReady={onVideoStart} />
        </div>
      )}
      <div
        className={`fixed inset-0 z-10 p-4 overflow-y-auto ${
          videoStart ? 'mt-40 opacity-70' : ''
        }`}
      >
        <h2 className="font-bold mb-1">语音识别</h2>
        <p>isTranscribing: {String(isTranscribing)}</p>
        {/* <p>isSpeaking: {String(isSpeaking)}</p> */}
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

        {/* <h2 className="text-2xl font-bold my-4">响应</h2>
        <p>completion: {lastAssistantMessage}</p> */}

        <h2 className="text-2xl font-bold my-4">历史</h2>
        <ul>
          {[...messageLog.slice(1)].reverse().map((message) => (
            <li key={message.created} className="mb-2">
              <span className="font-bold">{message.role}: </span>
              <span>{message.content}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-bold mb-4">虚拟人</h2>
        {/* <p>video: {vmsVideo}</p> */}
        <p>初始化中: {String(!videoReady)}</p>

        <div className="flex space-x-4">
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => vmsInit()}
          >
            Init
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => vmsControl()}
          >
            Action
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => vmsStop()}
          >
            Stop
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => getCompletionAndSpeak('Hello')}
          >
            Hello
          </button>
        </div>

        {/* <h2 className="font-bold mb-4">chatgpt语音识别</h2>

        <p>Recording: {String(recording)}</p>
        <p>Transcribing: {String(transcribing)}</p>
        <p>Speaking: {String(speaking)}</p>
        <p>Transcribed Text: {transcript.text}</p>
        <div className="flex space-x-4">
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => startRecording()}
          >
            start
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => pauseRecording()}
          >
            Pause
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => stopRecording()}
          >
            Stop
          </button>
        </div> */}
      </div>
    </>
  );
}
