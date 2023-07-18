'use client';
import VMS from '@/libs/TTS/VMS/xf';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import VideoPlayer from './Video';

export default function VMSChat() {
  const vms = useRef<VMS>();

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
    async function testAI() {
      // 虚拟人进行说话
      await vms.current?.textDrive(text);

      console.log('textDrive');
    }

    try {
      testAI();
    } catch (error) {
      console.log('error', error);
    }
  };

  const vmsControl = async () => {
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
            onClick={() => vmsPlay('Hello')}
          >
            Hello
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => vmsStop()}
          >
            Stop
          </button>
          <button
            className="mb-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => vmsControl()}
          >
            control
          </button>
        </div>
      </div>
    </>
  );
}
