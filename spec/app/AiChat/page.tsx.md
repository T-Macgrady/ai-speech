# AiChat Page

The `AiChat` page is responsible for displaying the AI chat interface. It consists of the following components:

- `RealTimeChat`: This component handles real-time chat functionality.
- `VMSChat`: This component handles chat functionality using VMS (Voice Messaging System).
- `Video`: This component displays a video player.

## File Structure

The file structure for the `AiChat` page is as follows:

```
src/
  app/
    AiChat/
      page.tsx
    SimultaneousInterpretation/
      page.tsx
    layout.tsx
    page.tsx
  components/
    ClientOnly.tsx
    RealTimeChat.tsx
    VMSChat.tsx
    Video.tsx
  hooks/
    useChatCompletion.ts
    useMessageLog.ts
    useSpeech2Text.ts
    useText2Speech.ts
  libs/
    TTS/
      VMS/
        xf/
          index.ts
      interface.ts
      webApi.ts
      xf/
        transcode.worker.d.ts
        transcode.worker.js
        xf.d.ts
        xf.js
  next-env.d.ts
  next.config.js
  postcss.config.js
  proxy.ts
  types/
    global.d.ts
  utils/
    Tts.ts
    lang.ts
    utils.ts
```

## Components

### `RealTimeChat`

The `RealTimeChat` component is responsible for handling real-time chat functionality. It is located in the `components/RealTimeChat.tsx` file.

### `VMSChat`

The `VMSChat` component is responsible for handling chat functionality using VMS (Voice Messaging System). It is located in the `components/VMSChat.tsx` file.

### `Video`

The `Video` component is responsible for displaying a video player. It is located in the `components/Video.tsx` file.

## Hooks

### `useChatCompletion`

The `useChatCompletion` hook is responsible for handling chat completion functionality. It is located in the `hooks/useChatCompletion.ts` file.

### `useMessageLog`

The `useMessageLog` hook is responsible for handling message logging functionality. It is located in the `hooks/useMessageLog.ts` file.

### `useSpeech2Text`

The `useSpeech2Text` hook is responsible for handling speech-to-text functionality. It is located in the `hooks/useSpeech2Text.ts` file.

### `useText2Speech`

The `useText2Speech` hook is responsible for handling text-to-speech functionality. It is located in the `hooks/useText2Speech.ts` file.

## Libraries

### TTS

The `TTS` library provides functionality for text-to-speech conversion. It is located in the `libs/TTS` directory and consists of the following files:

- `VMS`: This directory contains files related to VMS (Voice Messaging System) functionality.
- `interface.ts`: This file defines the interface for the TTS library.
- `webApi.ts`: This file provides the web API for the TTS library.
- `xf`: This directory contains files related to XF (Xfinity) functionality.

## Other Files

- `next-env.d.ts`: This file contains TypeScript declarations for Next.js environment.
- `next.config.js`: This file contains configuration for Next.js.
- `postcss.config.js`: This file contains configuration for PostCSS.
- `proxy.ts`: This file contains proxy configuration.
- `types/global.d.ts`: This file contains global TypeScript declarations.
- `utils/Tts.ts`: This file provides utility functions for text-to-speech functionality.
- `utils/lang.ts`: This file provides language-related utility functions.
- `utils/utils.ts`: This file provides general utility functions.
