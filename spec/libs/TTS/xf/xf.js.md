# libs/TTS/xf/xf.js.md

This file contains the implementation details for the `xf.js` module in the `libs/TTS/xf` directory.

## Module Overview

The `xf.js` module is responsible for providing transcoding functionality for the Text-to-Speech (TTS) feature in the application. It utilizes the `transcode.worker.js` worker script to perform the transcoding process.

## Dependencies

This module has the following dependencies:

- `@ffmpeg/core`: ^0.11.0
- `@ffmpeg/ffmpeg`: ^0.11.6
- `fluent-ffmpeg`: ^2.1.2

## Functions

### `transcode(inputFile: string, outputFile: string): Promise<void>`

This function is used to transcode the input audio file to a different format using FFmpeg. It takes in the `inputFile` path and the `outputFile` path as parameters and returns a promise that resolves when the transcoding process is complete.

Example usage:

```javascript
import { transcode } from './xf';

const inputFile = '/path/to/input/file.mp3';
const outputFile = '/path/to/output/file.wav';

transcode(inputFile, outputFile)
  .then(() => {
    console.log('Transcoding complete');
  })
  .catch((error) => {
    console.error('Transcoding failed:', error);
  });
```

### `getSupportedFormats(): Promise<string[]>`

This function is used to retrieve the list of supported audio formats for transcoding. It returns a promise that resolves with an array of supported formats.

Example usage:

```javascript
import { getSupportedFormats } from './xf';

getSupportedFormats()
  .then((formats) => {
    console.log('Supported formats:', formats);
  })
  .catch((error) => {
    console.error('Failed to retrieve supported formats:', error);
  });
```

## Worker Script

The `xf.js` module utilizes the `transcode.worker.js` worker script to perform the transcoding process. The worker script is responsible for executing the FFmpeg commands and handling the transcoding process asynchronously.

The `transcode.worker.js` script is located in the same directory as `xf.js` and is automatically loaded by the module.

## Usage

To use the `xf.js` module, import the desired functions from the module and call them as needed. Make sure to provide the correct file paths and handle any errors that may occur during the transcoding process.

```javascript
import { transcode, getSupportedFormats } from './xf';

// Transcode audio file
const inputFile = '/path/to/input/file.mp3';
const outputFile = '/path/to/output/file.wav';

transcode(inputFile, outputFile)
  .then(() => {
    console.log('Transcoding complete');
  })
  .catch((error) => {
    console.error('Transcoding failed:', error);
  });

// Get supported formats
getSupportedFormats()
  .then((formats) => {
    console.log('Supported formats:', formats);
  })
  .catch((error) => {
    console.error('Failed to retrieve supported formats:', error);
  });
```

## Conclusion

The `xf.js` module provides the necessary functionality for transcoding audio files using FFmpeg. It offers functions for performing the transcoding process and retrieving the list of supported formats.
