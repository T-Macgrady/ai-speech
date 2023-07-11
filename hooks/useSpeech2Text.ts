// useSpeech2Text hook 使用 SpeechRecognition API

import { useEffect, useRef, useState } from 'react';

export interface VoiceRecognitionResults {
  value: string;
  isFinal: boolean;
}

const useSpeech2Text = ({
  lang = '',
  autoStart = false,
  onRecognize,
  onEnd,
  enabledMultiSentences = false,
}: {
  lang?: string;
  autoStart?: boolean;
  onRecognize?: (value: { value: string; isFinal: boolean }) => void;
  onEnd?: () => void;
  enabledMultiSentences?: boolean;
}) => {
  const voiceRecognition = useRef<any>(null);
  const [text, setText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const init = () => {
    if (voiceRecognition.current) return;
    setIsTranscribing(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
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
    voiceRecognition.current.onend = (e) => {
      setIsTranscribing(false);
      if (onEnd) {
        onEnd();
      } else {
        voiceRecognition.current.start();
      }
    };

    voiceRecognition.current.onaudioend = (e) => {
      console.log('onaudioend:', e);
    };

    voiceRecognition.current.onaudiostart = (e) => {
      console.log('onaudiostart:', e);
    };

    voiceRecognition.current.onnomatch = (e) => {
      console.log('onnomatch:', e);
    };

    // voiceRecognition.current.onresult = (e) => {
    //   console.log('onresult:', e);
    // };

    voiceRecognition.current.onsoundend = (e) => {
      console.log('onsoundend:', e);
    };

    voiceRecognition.current.onsoundstart = (e) => {
      console.log('onsoundstart:', e);
    };

    voiceRecognition.current.onspeechend = (e) => {
      console.log('onspeechend:', e);
    };

    voiceRecognition.current.onspeechstart = (e) => {
      console.log('onspeechstart:', e);
    };

    voiceRecognition.current.onstart = (e) => {
      setIsTranscribing(true);
      console.log('onstart:', e);
    };
    console.log('--voiceRecognition.start--', voiceRecognition.current);
    voiceRecognition.current.start();
  };
  const start = () => {
    if (voiceRecognition.current) {
      voiceRecognition.current.start();
    } else {
      init();
      voiceRecognition.current.start();
    }
  };
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
  }, []);

  const handleRecognition = ({ isFinal, value }: VoiceRecognitionResults) => {
    value = value.trim();
    let message: string;

    if (value) {
      if (enabledMultiSentences) {
        let sentences = text.split('\n');
        if (isFinal) {
          sentences[sentences.length - 1] = value;
          sentences.push('');
        } else {
          sentences[sentences.length - 1] = value;
        }
        message = sentences.join('\n');
      } else message = value;
    }
  };

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
