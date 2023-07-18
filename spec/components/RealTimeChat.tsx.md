# RealTimeChat.tsx

## Description

The `RealTimeChat` component is responsible for displaying and managing real-time chat functionality in the application. It allows users to send and receive messages in real-time.

## Dependencies

The `RealTimeChat` component depends on the following modules:

- `react` version 18.2.0
- `react-dom` version 18.2.0
- `axios` version 1.4.0
- `uuid` version 9.0.0

## Usage

To use the `RealTimeChat` component, import it from the `components` directory:

```jsx
import RealTimeChat from '../components/RealTimeChat';
```

Then, include the component in your JSX code:

```jsx
<RealTimeChat />
```

## Props

The `RealTimeChat` component accepts the following props:

| Prop       | Type      | Description                            |
| ---------- | --------- | -------------------------------------- |
| `roomId`   | string    | The ID of the chat room.               |
| `username` | string    | The username of the current user.      |
| `messages` | Message[] | An array of messages in the chat room. |

## Example

```jsx
import React from 'react';
import RealTimeChat from '../components/RealTimeChat';

const ChatPage = () => {
  const roomId = '123';
  const username = 'John Doe';
  const messages = [
    { id: '1', sender: 'John Doe', content: 'Hello!' },
    { id: '2', sender: 'Jane Smith', content: 'Hi there!' },
  ];

  return (
    <div>
      <h1>Chat Room</h1>
      <RealTimeChat roomId={roomId} username={username} messages={messages} />
    </div>
  );
};

export default ChatPage;
```

In the above example, the `RealTimeChat` component is rendered within a `ChatPage` component. The `roomId`, `username`, and `messages` props are passed to the `RealTimeChat` component to configure and display the chat functionality.

## Notes

- The `RealTimeChat` component uses the `axios` module to send and receive messages from the server.
- The `uuid` module is used to generate unique IDs for each message in the chat room.
