'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
// import  from "@types/webspeechapi";

export interface VoiceRecognitionResults {
  value: string;
  isFinal: boolean;
}

const useSpeech2Text = ({
  lang = '',
  autoStart = false,
  onRecognize,
  onRecognizeEnd,
  onEnd,
}: {
  lang?: string;
  autoStart?: boolean;
  timeout?: number;
  onRecognize?: (value: string, event) => void;
  onRecognizeEnd?: (value: string) => void;
  onEnd?: (value: string | undefined, error?: SpeechRecognitionError) => void;
  enabledMultiSentences?: boolean;
}) => {
  const error = useRef<SpeechRecognitionError>();
  const voiceRecognition = useRef<SpeechRecognition>();
  const timer = useRef<number>();

  const [text, setText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const init = useCallback(() => {
    setIsTranscribing(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition.current = new SpeechRecognition();

    lang && (voiceRecognition.current!.lang = lang);
    voiceRecognition.current!.continuous = true;
    voiceRecognition.current!.interimResults = true;

    voiceRecognition.current!.onstart = (e) => {
      error.current = undefined;
      setIsTranscribing(true);
      console.log('voiceRecognition-onstart:', e);
    };
    voiceRecognition.current!.onerror = (e) => {
      console.error('voiceRecognition-onerror:', e);
      error.current = e;
    };
    voiceRecognition.current!.onresult = (event) => {
      const results = event.results[event.resultIndex];
      const value = results[0].transcript.trim();

      setText(value);
      onRecognize?.(value, event);
      console.log('--voiceRecognition-onresult--', value, results);
      if (results.isFinal && value) {
        console.log('--voiceRecognition-onRecognize-end--', value);
        onRecognizeEnd?.(value);
      }
    };
    voiceRecognition.current!.onend = () => {
      console.log('--voiceRecognition.current.onend--', text, error.current);
      setIsTranscribing(false);
      if (onEnd) {
        onEnd(text, error.current);
      } else {
        voiceRecognition.current!.start();
      }
    };

    voiceRecognition.current!.onaudioend = (e) => {
      console.log('voiceRecognition-onaudioend:', e);
    };

    voiceRecognition.current!.onaudiostart = (e) => {
      console.log('voiceRecognition-onaudiostart:', e);
    };

    voiceRecognition.current!.onnomatch = (e) => {
      console.log('voiceRecognition-onnomatch:', e);
    };

    voiceRecognition.current!.onsoundend = (e) => {
      console.log('voiceRecognition-onsoundend:', e);
    };

    voiceRecognition.current!.onsoundstart = (e) => {
      console.log('voiceRecognition-onsoundstart:', e);
    };

    voiceRecognition.current!.onspeechend = (e) => {
      console.log('voiceRecognition-onspeechend:', e);
    };

    voiceRecognition.current!.onspeechstart = (e) => {
      console.log('voiceRecognition-onspeechstart:', e);
    };

    voiceRecognition.current!.start();
  }, [lang, onEnd, onRecognize, onRecognizeEnd, text]);

  const start = useCallback(() => {
    voiceRecognition.current ? voiceRecognition.current?.start() : init();
  }, [init]);
  const abort = () => {
    voiceRecognition.current?.abort();
  };
  const stop = () => {
    console.log('--voiceRecognition.stop--');
    voiceRecognition.current?.stop();
  };

  useEffect(() => {
    autoStart && start();
  }, [autoStart, start]);

  return {
    isTranscribing,
    text,
    errorRef: error,
    start,
    stop,
    abort,
    init,
  };
};

export default useSpeech2Text;
