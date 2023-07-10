// useText2Speech hook

import { useEffect, useState } from 'react';
import ibmText2Speech from 'watson-speech/text-to-speech/index';

enum Type {
  WEB_API = 'webapi',
  ELEVEN_LABS = 'elevenLabs',
  // todo support more
  IBM = 'ibm',
  BAIDU = 'baidu',
  GOOGLE = 'google',
}

export default function useText2Speech(
  config: {
    type: Type;
  } = {
    type: Type.ELEVEN_LABS,
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
    console.log('--speak--', text, options, config);
    const speckAction = {
      [Type.WEB_API]: () => {
        webapiSpeak(text, options).catch(() => elevenLabsSpeak(text, options));
      },
      [Type.ELEVEN_LABS]: () => {
        elevenLabsSpeak(text, options).catch(() => webapiSpeak(text, options));
      },
      // todo support more
      [Type.IBM]: ibmSpeak,
      [Type.BAIDU]: baiduSpeak,
      [Type.GOOGLE]: googleSpeak,
    };
    speckAction[config.type](text, options);
  };

  return { speak, isSupportWebApi, langs };
}

// check if support SpeechSynthesisUtterance
const checkIfSupportWebApi = () => {
  return 'SpeechSynthesisUtterance' in window;
};
async function webapiSpeak(
  text: string,
  options: { lang: string } = { lang: 'en-US' },
) {
  return new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang;
    utterance.onerror = reject;
    utterance.onstart = () => {};
    utterance.onend = () => {
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

// 调用ibm的语音合成接口
function ibmSpeak(text: string, options: { lang: string }) {
  ibmText2Speech.synthesize({
    text,
    autoPlay: true,
    voice: 'en-US_AllisonVoice',
  });
}

// 调用百度的语音合成接口
function baiduSpeak(text: string, options: { lang: string }) {}

// 调用google的语音合成接口
function googleSpeak(text: string, options: { lang: string }) {
  const tss = new (window as any).GoogleTTS('zh-CN');
  tss.play(text, options.lang);
}

/**
 * https://api.elevenLabs.io/docs#/text-to-speech/Text_to_speech_v1_text_to_speech__voice_id__post
 * Converts the given text into speech using the specified voice and returns an audio file as a buffer.
 * @param {string} text The text to be converted to speech.
 * @param {Voice} [voice] The voice to be used for text-to-speech conversion. If not provided, the current voice will be used.
 * @returns {Promise<ArrayBuffer | null>} A promise that resolves to an ArrayBuffer containing the audio data, or null if the conversion fails.
 */
async function elevenLabsSpeak(
  text: string,
  options: { lang: string },
): Promise<ArrayBuffer | null> {
  const voice = '21m00Tcm4TlvDq8ikWAM';
  const url =
    'https://api.elevenLabs.io' +
    '/v1/text-to-speech/' +
    voice +
    '/stream' +
    '?optimize_streaming_latency=' +
    1;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const data = {
    text,
  };

  const response = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  });

  playAudioStream(response);

  return response.arrayBuffer();
}

function playAudioStream(response: Response) {
  const contentType = response.headers.get('Content-Type');

  response.arrayBuffer().then((buffer) => {
    const audioBlob = new Blob([buffer], { type: contentType });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.play();
  });
}
