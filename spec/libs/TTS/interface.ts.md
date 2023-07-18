# TTS Interface

The `TTS` interface provides methods for text-to-speech conversion using various TTS engines.

## Methods

### `speak(text: string): Promise<void>`

This method takes a `text` parameter and converts it into speech using the default TTS engine. It returns a `Promise` that resolves when the speech synthesis is complete.

#### Parameters

- `text` (string): The text to be converted into speech.

### `setEngine(engine: string): void`

This method sets the TTS engine to be used for speech synthesis.

#### Parameters

- `engine` (string): The name of the TTS engine to be used.

### `getAvailableEngines(): string[]`

This method returns an array of available TTS engines.

#### Returns

- `string[]`: An array of available TTS engines.

### `getSelectedEngine(): string`

This method returns the currently selected TTS engine.

#### Returns

- `string`: The name of the currently selected TTS engine.

### `getVoices(): Promise<string[]>`

This method returns a `Promise` that resolves to an array of available voices for the selected TTS engine.

#### Returns

- `Promise<string[]>`: A `Promise` that resolves to an array of available voices.

### `setVoice(voice: string): void`

This method sets the voice to be used for speech synthesis.

#### Parameters

- `voice` (string): The name of the voice to be used.

### `getSelectedVoice(): string`

This method returns the currently selected voice.

#### Returns

- `string`: The name of the currently selected voice.

### `setRate(rate: number): void`

This method sets the rate of speech synthesis.

#### Parameters

- `rate` (number): The rate of speech synthesis. The default value is 1.

### `getRate(): number`

This method returns the current rate of speech synthesis.

#### Returns

- `number`: The current rate of speech synthesis.

### `setPitch(pitch: number): void`

This method sets the pitch of speech synthesis.

#### Parameters

- `pitch` (number): The pitch of speech synthesis. The default value is 1.

### `getPitch(): number`

This method returns the current pitch of speech synthesis.

#### Returns

- `number`: The current pitch of speech synthesis.

### `setVolume(volume: number): void`

This method sets the volume of speech synthesis.

#### Parameters

- `volume` (number): The volume of speech synthesis. The default value is 1.

### `getVolume(): number`

This method returns the current volume of speech synthesis.

#### Returns

- `number`: The current volume of speech synthesis.

### `pause(): void`

This method pauses the speech synthesis.

### `resume(): void`

This method resumes the speech synthesis.

### `cancel(): void`

This method cancels the speech synthesis.

### `isSpeaking(): boolean`

This method returns a boolean value indicating whether speech synthesis is currently in progress.

#### Returns

- `boolean`: `true` if speech synthesis is in progress, `false` otherwise.
