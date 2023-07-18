# `hooks/useMessageLog.ts`

This file contains the implementation of the `useMessageLog` custom hook.

## Dependencies

This file has the following dependencies:

- `react` (version 18.2.0)

## Usage

To use the `useMessageLog` hook, import it from this file:

```typescript
import { useMessageLog } from '../hooks/useMessageLog';
```

Then, you can use the hook in your functional component:

```typescript
const MyComponent: React.FC = () => {
  const { messages, addMessage } = useMessageLog();

  // Rest of the component code

  return (
    // JSX code
  );
};
```

## API

The `useMessageLog` hook provides the following API:

### `messages`

An array of messages representing the message log.

### `addMessage(message: string): void`

A function that adds a new message to the message log.

#### Parameters

- `message` (string): The message to be added to the log.

## Example

Here's an example of how to use the `useMessageLog` hook:

```typescript
import { useMessageLog } from '../hooks/useMessageLog';

const MyComponent: React.FC = () => {
  const { messages, addMessage } = useMessageLog();

  const handleClick = () => {
    addMessage('Button clicked!');
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
```

In this example, a message log is displayed on the screen. When the button is clicked, a new message is added to the log.
