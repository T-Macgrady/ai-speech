// useText2Speech hook

import { useEffect, useState } from 'react';
// import ibmText2Speech from 'watson-speech/text-to-speech/index';

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

  const speak = async (
    text: string,
    options: { lang: string } = {
      lang: 'en-US',
    },
  ) => {
    console.log('--speak--', text, options, config);
    const speckAction = {
      [Type.WEB_API]: async () => {
        await webapiSpeak(text, options).catch(() =>
          elevenLabsSpeak(text, options),
        );
      },
      [Type.ELEVEN_LABS]: async () => {
        await elevenLabsSpeak(text, options).catch(() =>
          webapiSpeak(text, options),
        );
      },
      // todo support more
      [Type.IBM]: ibmSpeak,
      [Type.BAIDU]: baiduSpeak,
      [Type.GOOGLE]: googleSpeak,
    };
    await speckAction[config.type](text, options);
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
    utterance.onerror = (e) => {
      reject('webapi speak error:' + e);
    };
    utterance.onstart = () => {};
    utterance.onend = () => {
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

// 调用ibm的语音合成接口
async function ibmSpeak(text: string, options: { lang: string }) {
  // ibmText2Speech.synthesize({
  //   text,
  //   autoPlay: true,
  //   voice: 'en-US_AllisonVoice',
  // });
}

// 调用百度的语音合成接口
async function baiduSpeak(text: string, options: { lang: string }) {}

// 调用google的语音合成接口
async function googleSpeak(text: string, options: { lang: string }) {
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
): Promise<void> {
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
    'xi-api-key': '8f1d557f9cbb41f81314b5353a16c84c',
  };
  const data = {
    text,
  };

  const response = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  });

  await playAudioStream(response).catch((err) => {
    console.log('playAudioStream-error', err);
  });
}

function playAudioStream(response: Response) {
  return new Promise<void>((resolve, reject) => {
    const contentType = response.headers.get('Content-Type');

    response.arrayBuffer().then((buffer) => {
      const audioBlob = new Blob([buffer], { type: contentType });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        console.log('audio.onended-----');
        resolve();
      };
      audio.onerror = reject;
      audio.play();
    });
  });
}
