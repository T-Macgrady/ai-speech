## `hooks/useSpeech2Text.ts`

### Description

This file contains the implementation of the `useSpeech2Text` custom hook. This hook provides functionality for converting speech input into text using the Web Speech API.

### Dependencies

This file does not have any external dependencies.

### Code

```typescript
import { useEffect, useState } from 'react';

const useSpeech2Text = (): string => {
  const [text, setText] = useState('');

  useEffect(() => {
    const recognition = new window.SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return text;
};

export default useSpeech2Text;
```

### Usage

To use the `useSpeech2Text` hook, follow these steps:

1. Import the hook into your component:

   ```typescript
   import useSpeech2Text from '../hooks/useSpeech2Text';
   ```

2. Call the `useSpeech2Text` hook in your component:

   ```typescript
   const text = useSpeech2Text();
   ```

   The `text` variable will contain the converted speech input as text.

### Example

Here's an example of how to use the `useSpeech2Text` hook in a component:

```typescript
import React from 'react';
import useSpeech2Text from '../hooks/useSpeech2Text';

const SpeechToTextComponent: React.FC = () => {
  const text = useSpeech2Text();

  return (
    <div>
      <h1>Speech to Text</h1>
      <p>{text}</p>
    </div>
  );
};

export default SpeechToTextComponent;
```

In this example, the component displays the converted speech input as text.
