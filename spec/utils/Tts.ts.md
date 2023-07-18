# Tts.ts

This file contains utility functions related to text-to-speech (TTS) functionality.

## Functions

### `speak(text: string): void`

This function takes a `text` parameter of type `string` and converts it into speech using the TTS engine. It does not return any value.

Example usage:

```typescript
speak('Hello, how are you?');
```

### `stopSpeaking(): void`

This function stops the current speech playback. It does not take any parameters and does not return any value.

Example usage:

```typescript
stopSpeaking();
```

### `setVolume(volume: number): void`

This function sets the volume of the speech playback. The `volume` parameter is a number between 0 and 1, where 0 is muted and 1 is the maximum volume.

Example usage:

```typescript
setVolume(0.5);
```

### `setRate(rate: number): void`

This function sets the rate of the speech playback. The `rate` parameter is a number representing the speech rate, where 1 is the normal rate.

Example usage:

```typescript
setRate(1.5);
```

### `setPitch(pitch: number): void`

This function sets the pitch of the speech playback. The `pitch` parameter is a number representing the speech pitch, where 1 is the normal pitch.

Example usage:

```typescript
setPitch(0.8);
```

### `getVoices(): Promise<Voice[]>`

This function returns a promise that resolves to an array of `Voice` objects representing the available voices for speech synthesis.

Example usage:

```typescript
const voices = await getVoices();
console.log(voices);
```

## Interfaces

### `Voice`

This interface represents a voice for speech synthesis.

Properties:

- `name` (string): The name of the voice.
- `lang` (string): The language code of the voice.
- `default` (boolean): Indicates if the voice is the default voice.
- `localService` (boolean): Indicates if the voice is a local service voice.
- `voiceURI` (string): The URI of the voice.

Example usage:

```typescript
const voice: Voice = {
  name: 'Google US English',
  lang: 'en-US',
  default: true,
  localService: false,
  voiceURI: 'Google US English',
};
```
