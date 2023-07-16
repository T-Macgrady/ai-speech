import { useEffect, useRef } from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

const VideoPlayer = ({
  url,
  className,
  onReady,
}: {
  url: string;
  className?: string;
  onReady?: () => void;
}) => {
  const videoNode = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoNode.current) return;

    const videoJsOptions = {
      autoplay: true,
      controls: false,
      fluid: true,
      muted: true,
      sources: [
        {
          src: url,
          type: 'application/x-mpegURL',
        },
      ],
    };

    // Initialize video.js player
    const player = videojs(
      videoNode.current,
      videoJsOptions,
      function onPlayerReady() {
        console.log('Player Ready');
        // 设置初始音量值。这里是设置为 50%。
        player.volume(0.5);

        setTimeout(() => {
          onReady?.();
        }, 1500);
      },
    );

    // Clean up on unmount
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [onReady, url]);

  return (
    <div data-vjs-player className={className}>
      <video ref={videoNode} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
