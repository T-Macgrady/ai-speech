export class TTSRecorder {
  constructor(params: {
    speed?: number;
    voice?: number;
    pitch?: number;
    voiceName?: string;
    appId?: string;
    text?: string;
    tte?: string;
    defaultText?: string;
  });

  setParams(params: {
    speed?: number;
    voice?: number;
    pitch?: number;
    text?: string;
    voiceName?: string;
    tte?: string;
  }): void;

  connectWebSocket(): Promise<void>;

  webSocketSend(): void;

  result(resultData: string): void;

  resetAudio(): void;

  audioInit(): void;

  audioPlay(): void;

  audioStop(): void;

  start(): void;

  stop(): void;
}
