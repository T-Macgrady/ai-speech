export interface TTSBase {
  config: {
    text: string;

    lang: string;

    speed?: number;

    pitch?: number;

    volume?: number;

    rate?: number;

    voice?: unknown;
  };

  ifSupported?: boolean;

  get speaking(): boolean;

  get paused(): boolean;

  init?: () => Promise<void>;

  play: () => Promise<void>;

  pause: () => void;

  resume: () => void;

  cancel: () => void;

  startPromise?: () => Promise<void>;

  endPromise?: () => Promise<void>;

  errorPromise: () => Promise<unknown>;
}
