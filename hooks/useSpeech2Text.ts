// useSpeech2Text hook 使用 SpeechRecognition API

import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceRecognitionResults {
  value: string;
  isFinal: boolean;
}

const useSpeech2Text = ({
  // lang = '',
  autoStart = false,
  onRecognize,
  onEnd,
}: {
  // lang?: string;
  autoStart?: boolean;
  onRecognize?: (value: { value: string; isFinal: boolean }) => void;
  onEnd?: () => void;
  enabledMultiSentences?: boolean;
}) => {
  const voiceRecognition = useRef<any>(null);
  const [text, setText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const init = useCallback(() => {
    if (voiceRecognition.current) return;
    setIsTranscribing(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition.current = new SpeechRecognition();

    // voiceRecognition.current.lang = lang;
    voiceRecognition.current.continuous = true;
    voiceRecognition.current.interimResults = true;

    voiceRecognition.current.onresult = (event: any) => {
      const results = event.results[event.resultIndex];
      const value = results[0].transcript.trim();

      console.log('--voiceRecognition.current-value--', value, results);
      setText(value);
      onRecognize?.({ value, isFinal: results.isFinal });
    };
    voiceRecognition.current.onend = () => {
      setIsTranscribing(false);
      if (onEnd) {
        onEnd();
      } else {
        voiceRecognition.current.start();
      }
    };

    voiceRecognition.current.onaudioend = (e: any) => {
      console.log('onaudioend:', e);
    };

    voiceRecognition.current.onaudiostart = (e: any) => {
      console.log('onaudiostart:', e);
    };

    voiceRecognition.current.onnomatch = (e: any) => {
      console.log('onnomatch:', e);
    };

    // voiceRecognition.current.onresult = (e: any) => {
    //   console.log('onresult:', e);
    // };

    voiceRecognition.current.onsoundend = (e: any) => {
      console.log('onsoundend:', e);
    };

    voiceRecognition.current.onsoundstart = (e: any) => {
      console.log('onsoundstart:', e);
    };

    voiceRecognition.current.onspeechend = (e: any) => {
      console.log('onspeechend:', e);
    };

    voiceRecognition.current.onspeechstart = (e: any) => {
      console.log('onspeechstart:', e);
    };

    voiceRecognition.current.onstart = (e: any) => {
      setIsTranscribing(true);
      console.log('onstart:', e);
    };
    console.log('--voiceRecognition.start--', voiceRecognition.current);
    voiceRecognition.current.start();
  }, [onEnd, onRecognize]);
  const start = useCallback(() => {
    if (voiceRecognition.current) {
      voiceRecognition.current.start();
    } else {
      init();
      // voiceRecognition.current.start();
    }
  }, [init]);
  const abort = () => {
    if (voiceRecognition.current) {
      voiceRecognition.current.abort();
    }
  };
  const stop = () => {
    if (voiceRecognition.current) {
      voiceRecognition.current.stop();
    }
  };

  useEffect(() => {
    autoStart && start();
  }, [autoStart, start]);

  return {
    isTranscribing,
    text,
    start,
    stop,
    abort,
    init,
  };
};

export default useSpeech2Text;
