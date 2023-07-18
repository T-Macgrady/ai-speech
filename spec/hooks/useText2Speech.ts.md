# `hooks/useText2Speech.ts`

## Description

This file contains the implementation of the `useText2Speech` hook, which is responsible for converting text to speech using the TTS (Text-to-Speech) library.

## Dependencies

This file has the following dependencies:

- `libs/TTS/webApi.ts`: This file contains the implementation of the TTS web API.
- `libs/TTS/interface.ts`: This file contains the interface definitions for the TTS library.

## Functions

### `useText2Speech`

```typescript
function useText2Speech(): {
  speak: (text: string) => void;
  cancel: () => void;
};
```

This function returns an object with the following methods:

- `speak`: This method takes a `text` parameter and converts it to speech using the TTS library.
- `cancel`: This method cancels the current speech synthesis.

## Usage

```typescript
import { useText2Speech } from '../hooks/useText2Speech';

function MyComponent() {
  const { speak, cancel } = useText2Speech();

  const handleSpeak = () => {
    speak('Hello, world!');
  };

  const handleCancel = () => {
    cancel();
  };

  return (
    <div>
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}
```

In the above example, the `useText2Speech` hook is used to convert the text "Hello, world!" to speech. The `speak` method is called when the "Speak" button is clicked, and the `cancel` method is called when the "Cancel" button is clicked.

Note: Make sure to import the `useText2Speech` hook from the correct file path based on your project structure.
