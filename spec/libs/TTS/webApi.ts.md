# TTS Web API

The `webApi.ts` file in the `libs/TTS` directory contains the implementation of the TTS (Text-to-Speech) Web API. This API provides functions for converting text into speech using various TTS engines.

## Table of Contents

- [Dependencies](#dependencies)
- [API Functions](#api-functions)
  - [initialize](#initialize)
  - [synthesize](#synthesize)
  - [getVoices](#getvoices)
- [Types](#types)
  - [TTSOptions](#ttsoptions)
  - [TTSVoice](#ttsvoice)

## Dependencies

The following NPM modules are required to use the TTS Web API:

- `mespeak`: ^2.0.2
- `tts-react`: ^3.0.0

Make sure to install these modules before using the TTS Web API.

## API Functions

### initialize

The `initialize` function initializes the TTS Web API and sets the default TTS engine.

```typescript
initialize(engine: string): void
```

**Parameters:**

- `engine` (string): The name of the TTS engine to use. Currently supported engines are "mespeak" and "tts-react".

**Example:**

```typescript
import { initialize } from './libs/TTS/webApi';

initialize('mespeak');
```

### synthesize

The `synthesize` function converts text into speech using the specified TTS engine.

```typescript
synthesize(text: string, options?: TTSOptions): Promise<void>
```

**Parameters:**

- `text` (string): The text to convert into speech.
- `options` (optional, TTSOptions): Additional options for the TTS engine.

**Example:**

```typescript
import { synthesize } from './libs/TTS/webApi';

synthesize('Hello, world!');
```

### getVoices

The `getVoices` function returns a list of available voices for the current TTS engine.

```typescript
getVoices(): TTSVoice[]
```

**Returns:**

- `TTSVoice[]`: An array of TTSVoice objects representing the available voices.

**Example:**

```typescript
import { getVoices } from './libs/TTS/webApi';

const voices = getVoices();
console.log(voices);
```

## Types

### TTSOptions

The `TTSOptions` type represents additional options for the TTS engine.

```typescript
interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
}
```

**Properties:**

- `voice` (optional, string): The name of the voice to use for speech synthesis.
- `speed` (optional, number): The speed of speech synthesis. Default is 1.0.
- `pitch` (optional, number): The pitch of speech synthesis. Default is 1.0.
- `volume` (optional, number): The volume of speech synthesis. Default is 1.0.

**Example:**

```typescript
import { TTSOptions } from './libs/TTS/webApi';

const options: TTSOptions = {
  voice: 'en-US',
  speed: 1.2,
  pitch: 0.8,
  volume: 0.5,
};
```

### TTSVoice

The `TTSVoice` type represents a voice available for speech synthesis.

```typescript
interface TTSVoice {
  name: string;
  lang: string;
}
```

**Properties:**

- `name` (string): The name of the voice.
- `lang` (string): The language of the voice.

**Example:**

```typescript
import { TTSVoice } from './libs/TTS/webApi';

const voice: TTSVoice = {
  name: 'en-US',
  lang: 'English (United States)',
};
```
