# Video Component

The `Video` component is responsible for rendering a video player on the page.

## Props

| Name      | Type    | Default | Description                                                      |
| --------- | ------- | ------- | ---------------------------------------------------------------- |
| src       | string  | -       | The URL of the video file to be played.                          |
| autoplay  | boolean | false   | Determines whether the video should start playing automatically. |
| controls  | boolean | true    | Determines whether the video controls should be displayed.       |
| loop      | boolean | false   | Determines whether the video should loop after it ends.          |
| muted     | boolean | false   | Determines whether the video should be muted.                    |
| poster    | string  | -       | The URL of an image to be displayed as the video poster.         |
| className | string  | -       | Additional CSS class name(s) for the video player container.     |

## Example Usage

```jsx
import Video from './Video';

const App = () => {
  return (
    <div>
      <Video
        src="https://example.com/video.mp4"
        autoplay={true}
        controls={true}
        loop={false}
        muted={false}
        poster="https://example.com/poster.jpg"
        className="video-player"
      />
    </div>
  );
};

export default App;
```

In the above example, the `Video` component is imported and rendered within the `App` component. The `src` prop specifies the URL of the video file to be played, while the `autoplay`, `controls`, `loop`, `muted`, `poster`, and `className` props are used to customize the video player's behavior and appearance.
