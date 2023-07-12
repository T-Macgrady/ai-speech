'use client';

import { useEffect, useRef, useState } from 'react';
import { useTts } from 'tts-react';
import { Tts } from '@/utils/Tts';

// import ibmText2Speech from 'watson-speech/text-to-speech/index';
// import * as mespeak from 'mespeak';
// import { Controller } from 'tts-react/dist/controller.js';

// import type { TTSHookProps } from 'tts-react';

// type SpeakProps = Pick<TTSHookProps, 'children'>;

// let ifMeSpeakInit = false;

enum Type {
  WEB_API = 'webapi',
  ELEVEN_LABS = 'elevenLabs',
  TTS = 'tts',
  // todo support more
  IBM = 'ibm',
  BAIDU = 'baidu',
  GOOGLE = 'google',
}

type TTSOptions = {
  lang: string;
  voice?: SpeechSynthesisVoice;
};

export default function useText2Speech(
  config: {
    type: Type;
  } = {
    type: Type.TTS,
  },
) {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const [isSupportWebApi, setIsSupportWebApi] = useState(false);
  const [langs, setLangs] = useState<string[]>([]);
  // const [_text, setText] = useState('hello world');
  const [isSpeeching, setIsSpeeching] = useState(false);

  const { play } = useTts({
    children: '',
  });

  useEffect(() => {
    const isSupportWebApi = checkIfSupportWebApi();
    setIsSupportWebApi(isSupportWebApi);
    if (isSupportWebApi) {
      voicesRef.current = window.speechSynthesis.getVoices();
      setLangs(voicesRef.current.map((voice) => voice.lang));
    }
  }, []);

  const speak = async (
    text: string,
    options: TTSOptions = {
      lang: 'en-US',
    },
  ) => {
    try {
      setIsSpeeching(true);
      console.log('--speak--', text, options, config);
      const speckAction = {
        [Type.WEB_API]: async () => {
          await webapiSpeak(text, options).catch((e) => {
            console.error('webapi speak error:', e);
            elevenLabsSpeak(text);
          });
        },
        [Type.TTS]: TTSSpeak,
        [Type.ELEVEN_LABS]: async () => {
          await elevenLabsSpeak(text).catch(() => webapiSpeak(text, options));
        },
        // todo support more
        [Type.IBM]: ibmSpeak,
        [Type.BAIDU]: baiduSpeak,
        [Type.GOOGLE]: googleSpeak,
      };
      // setText(text);
      // setTimeout(() => {
      //   play();
      // }, 1000);
      // play();
      const voice =
        voicesRef.current.find((v) => v.lang === options.lang) ||
        voicesRef.current[0];
      play();
      await speckAction[config.type](text, { ...options, voice });
    } catch (e) {
      console.error('speak error:', e);
    } finally {
      setIsSpeeching(false);
    }
  };

  return { speak, isSpeeching, isSupportWebApi, langs };
}

// check if support SpeechSynthesisUtterance
const checkIfSupportWebApi = () => {
  return 'SpeechSynthesisUtterance' in window;
};
async function webapiSpeak(
  text: string,
  options: TTSOptions = { lang: 'en-US' },
) {
  return new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => {
        return voice.lang === options.lang;
      }) || voices[0];
    console.log(utterance.voice, voices);
    utterance.onerror = (e) => {
      reject('webapi speak error:' + e);
    };
    utterance.onstart = () => {};
    utterance.onend = () => {
      resolve();
    };
    window.speechSynthesis.speak(utterance);
    // if (!ifMeSpeakInit) {
    //   mespeak.loadConfig(require('mespeak/src/mespeak_config.json'));
    //   mespeak.loadVoice(require('mespeak/voices/en/en-wm.json'));
    //   ifMeSpeakInit = true;
    // }
    // console.error('webapi speak', text, options);
    // mespeak.speak(text, { pitch: 45, speed: 140, Amplitude: 90 });
    // resolve();
    // window.responsiveVoice.speak("Hello, this is a test.")
  });
}
async function TTSSpeak(text: string, options: TTSOptions = { lang: 'en-US' }) {
  return new Promise<void>((resolve) => {
    const tts = new Tts({
      voice: options.voice,
    });
    tts.text = text;
    tts.volume = 1;
    tts.lang = options.lang;
    console.log('--tts---', tts.lang, options);

    tts.play();
    resolve();
  });
}

// 调用ibm的语音合成接口
async function ibmSpeak() {
  // ibmText2Speech.synthesize({
  //   text,
  //   autoPlay: true,
  //   voice: 'en-US_AllisonVoice',
  // });
}

// 调用百度的语音合成接口
async function baiduSpeak() {}

// 调用google的语音合成接口
async function googleSpeak(text: string, options: TTSOptions) {
  const tss = new window.GoogleTTS('zh-CN');
  tss.play(text, options.lang);
}

/**
 * https://api.elevenLabs.io/docs#/text-to-speech/Text_to_speech_v1_text_to_speech__voice_id__post
 * Converts the given text into speech using the specified voice and returns an audio file as a buffer.
 * @param {string} text The text to be converted to speech.
 * @param {Voice} [voice] The voice to be used for text-to-speech conversion. If not provided, the current voice will be used.
 * @returns {Promise<ArrayBuffer | null>} A promise that resolves to an ArrayBuffer containing the audio data, or null if the conversion fails.
 */
async function elevenLabsSpeak(text: string): Promise<void> {
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
