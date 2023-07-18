# `libs/TTS/xf/transcode.worker.d.ts` Specification

## Description

This file contains the TypeScript declaration for the `transcode.worker` module in the `libs/TTS/xf` directory. It provides type definitions for the functions and variables used in the `transcode.worker.js` file.

## Definitions

### `TranscodeWorker` Interface

```typescript
interface TranscodeWorker {
  onmessage: (event: MessageEvent) => void;
  postMessage: (message: any) => void;
}
```

- `onmessage`: A function that handles the `message` event received by the worker.
- `postMessage`: A function that sends a message to the main thread.

### `TranscodeWorkerGlobalScope` Interface

```typescript
interface TranscodeWorkerGlobalScope extends WorkerGlobalScope {
  self: TranscodeWorkerGlobalScope;
}
```

- `self`: A reference to the worker itself.

### `createTranscodeWorker` Function

```typescript
declare function createTranscodeWorker(): TranscodeWorker;
```

- `createTranscodeWorker`: A function that creates a new instance of the `TranscodeWorker` interface.

## Usage

To use the `transcode.worker` module, import the `createTranscodeWorker` function and create a new instance of the `TranscodeWorker` interface.

Example:

```typescript
import { createTranscodeWorker } from 'libs/TTS/xf/transcode.worker';

const worker = createTranscodeWorker();

worker.onmessage = (event) => {
  // Handle message event
};

worker.postMessage('Hello, worker!');
```

Note: This specification is based on the existing source code file `libs/TTS/xf/transcode.worker.js`.
