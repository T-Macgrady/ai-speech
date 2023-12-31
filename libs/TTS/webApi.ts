import { TTSBase } from './interface';

export class WebApiTTS implements TTSBase {
  // config: TTSBase['config'];
  // text = '';
  // lang = 'zh-CN';
  // rate?: number = 1; // 0.1 to 10，speed
  // pitch?: number = 1; // 0 to 2
  // volume?: number = 1; // 0 to 1
  // voice?: unknown;

  private utterance: SpeechSynthesisUtterance = {} as SpeechSynthesisUtterance;

  static readonly voices = window.speechSynthesis?.getVoices();

  static readonly ifSupported = 'SpeechSynthesisUtterance' in window;

  startPromise: Promise<void> = new Promise(() => '');

  endPromise: Promise<void> = new Promise(() => '');

  errorPromise: Promise<unknown> = new Promise(() => '');

  pausePromise: Promise<void> = new Promise(() => '');

  constructor(public config: TTSBase['config']) {
    this?.init();
  }

  get voice() {
    return (
      WebApiTTS.voices.find((voice) => {
        return voice.lang.includes(this.config.lang);
      }) || WebApiTTS.voices[0]
    );
  }

  get speaking() {
    return window.speechSynthesis.speaking;
  }

  get paused() {
    return window.speechSynthesis.paused;
  }

  async init() {
    if (!WebApiTTS.ifSupported) {
      new Error('webapi not supported:' + this.config.lang);
      return;
    }

    this.utterance = new SpeechSynthesisUtterance(this.config.text);
    if (!this.utterance) return;
    Object.keys(this.config).forEach((key) => {
      if (this.config[key]) {
        this.utterance[key] = this.config[key];
      }
    });
    this.utterance.voice = this.voice;
    console.log('vwebapi-utterance', this.utterance);
    this.startPromise = this._startPromise();
    this.pausePromise = this._pausePromise();
    this.endPromise = this._endPromise();
    this.errorPromise = this._errorPromise();
  }

  async play() {
    window.speechSynthesis.speak(this.utterance);
    await this.endPromise;
  }

  pause() {
    window.speechSynthesis.pause();
  }

  resume() {
    window.speechSynthesis.resume();
  }

  cancel() {
    window.speechSynthesis.cancel();
  }

  _startPromise() {
    return new Promise<void>((resolve) => {
      this.utterance.onstart = () => {
        console.warn('startPromise');
        resolve();
      };
    });
  }

  _endPromise() {
    return new Promise<void>((resolve) => {
      this.utterance.onend = () => {
        console.warn('endPromise');
        resolve();
      };
    });
  }

  _errorPromise() {
    return new Promise<unknown>((resolve) => {
      this.utterance.onerror = (e: unknown) => {
        console.error('errorPromise', e);
        resolve(e);
      };
    });
  }

  _pausePromise() {
    return new Promise<void>((resolve) => {
      this.utterance.onpause = () => {
        resolve();
      };
    });
  }
}
