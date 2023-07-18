# `libs/TTS/xf/xf.d.ts.md`

## Table of Contents

- [Module `xf`](#module-xf)
  - [Type `TranscodeWorker`](#type-transcodeworker)
  - [Function `createTranscodeWorker`](#function-createtranscodeworker)
  - [Function `transcode`](#function-transcode)
  - [Function `cancelTranscode`](#function-canceltranscode)

---

## Module `xf`

This module provides functions and types for transcoding audio files using the XF library.

### Type `TranscodeWorker`

```typescript
type TranscodeWorker = Worker & {
  onmessage: (event: MessageEvent<TranscodeWorkerMessage>) => void;
  postMessage: (message: TranscodeWorkerMessage) => void;
};
```

The `TranscodeWorker` type extends the `Worker` type and adds the `onmessage` and `postMessage` properties specific to the transcode worker.

### Function `createTranscodeWorker`

```typescript
function createTranscodeWorker(): TranscodeWorker;
```

The `createTranscodeWorker` function creates a new instance of the `TranscodeWorker` type.

**Example:**

```typescript
const worker = createTranscodeWorker();
```

### Function `transcode`

```typescript
function transcode(
  worker: TranscodeWorker,
  input: ArrayBuffer,
  outputFormat: string,
): Promise<ArrayBuffer>;
```

The `transcode` function starts the transcoding process using the specified `worker`, `input` audio data, and `outputFormat`. It returns a promise that resolves with the transcoded audio data as an `ArrayBuffer`.

**Parameters:**

- `worker`: The transcode worker created using `createTranscodeWorker`.
- `input`: The input audio data as an `ArrayBuffer`.
- `outputFormat`: The desired output format for the transcoded audio.

**Returns:**

A promise that resolves with the transcoded audio data as an `ArrayBuffer`.

**Example:**

```typescript
const worker = createTranscodeWorker();
const input = new ArrayBuffer(1024);
const outputFormat = 'mp3';

transcode(worker, input, outputFormat)
  .then((output) => {
    // Handle the transcoded audio data
  })
  .catch((error) => {
    // Handle the transcoding error
  });
```

### Function `cancelTranscode`

```typescript
function cancelTranscode(worker: TranscodeWorker): void;
```

The `cancelTranscode` function cancels the ongoing transcoding process performed by the specified `worker`.

**Parameters:**

- `worker`: The transcode worker created using `createTranscodeWorker`.

**Example:**

```typescript
const worker = createTranscodeWorker();

// Start the transcoding process
transcode(worker, input, outputFormat);

// Cancel the transcoding process
cancelTranscode(worker);
```

---
