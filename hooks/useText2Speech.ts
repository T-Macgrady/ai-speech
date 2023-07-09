// useText2Speech hook

import { useEffect, useState } from 'react';

enum Type {
  WEB_API = 'webapi',
  // todo support more
  IBM = 'ibm',
  BAIDU = 'baidu',
  GOOGLE = 'google',
}

export default function useText2Speech(
  config: {
    type: Type;
  } = {
    type: Type.WEB_API,
  },
) {
  const [isSupportWebApi, setIsSupportWebApi] = useState(false);
  const [langs, setLangs] = useState<string[]>([]);

  useEffect(() => {
    const isSupport = checkIfSupportWebApi();
    setIsSupportWebApi(isSupport);
    if (isSupport) {
      const voices = window.speechSynthesis.getVoices();
      setLangs(voices.map((voice) => voice.lang));
    }
  }, []);

  const speak = (
    text: string,
    options: { lang: string } = {
      lang: 'en-US',
    },
  ) => {
    console.log('--speak--', text, options);
    if (config.type === Type.WEB_API) {
      if (isSupportWebApi) {
        webapiSpeak(text, options);
      } else {
        console.log('SpeechSynthesisUtterance is not supported');
      }
    }
  };

  return { speak, isSupportWebApi, langs };
}

// check if support SpeechSynthesisUtterance
const checkIfSupportWebApi = () => {
  return 'SpeechSynthesisUtterance' in window;
};
function webapiSpeak(
  text: string,
  options: { lang: string } = { lang: 'en-US' },
) {
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang;
  window.speechSynthesis.speak(utterance);
}
