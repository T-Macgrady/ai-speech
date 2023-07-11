import { useEffect, useRef, useState } from 'react';
import type { Harker } from 'hark';

export function useSpeaking({
  onSpeaking,
}: {
  onSpeaking: (speaking: boolean) => void;
}) {
  const constantListener = useRef<Harker>();
  const constantStream = useRef<MediaStream>();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const init = async () => {
    if (!constantStream.current) {
      constantStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (!constantListener.current) {
        const { default: hark } = await import('hark');
        constantListener.current = hark(constantStream.current, {
          interval: 100,
          play: false,
        });
        constantListener.current.on('speaking', () => {
          console.log('speaking111111');
          setIsSpeaking(true);
          onSpeaking(true);
        });
        constantListener.current.on('stopped_speaking', () => {
          console.log('stopped_speaking111111');
          setIsSpeaking(false);
          onSpeaking(false);
        });
        console.log('constantListener.current', constantListener.current);
      }
    }
  };
  const reset = () => {
    if (constantStream.current) {
      constantStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      constantStream.current = undefined;
    }
    if (constantListener.current) {
      // @ts-ignore
      constantListener.current.off('speaking');
      // @ts-ignore
      constantListener.current.off('stopped_speaking');
      constantListener.current.stop();
      constantListener.current = undefined;
    }
  }
  const restart = () => {
    reset();
    init();
  }
  // useEffect(() => {
  //   setTimeout(() => {
  //     init();
  //   }, 2000);
  //   // init();
  // }, []);

  return {
    init,
    reset,
    restart,
    isSpeaking,
  };
}
