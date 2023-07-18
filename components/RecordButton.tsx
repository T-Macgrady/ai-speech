// 录音按钮组件
import classNames from 'classnames';
import { FaMicrophone, FaSpinner, FaStop } from 'react-icons/fa';

interface RecordButtonProps {
  isTranscribing: boolean;
  isSpeeching?: boolean;
  isFetching: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function RecordButton({
  isTranscribing,
  isSpeeching,
  isFetching,
  onStart,
  onStop,
}: RecordButtonProps) {
  return (
    <div className="relative flex flex-col items-center">
      <button
        className={classNames(
          'hover:bg-blue-700 text-white font-bold p-8 rounded-full transition-all duration-300 ease-in-out',
          {
            'bg-red-500': isTranscribing,
            'bg-gray-500': isSpeeching || isFetching,
            'bg-blue-500': !isTranscribing && !isSpeeching && !isFetching,
          },
        )}
        onClick={isTranscribing || isSpeeching || isFetching ? onStop : onStart}
      >
        {isTranscribing ? (
          <FaStop className="h-16 w-16" />
        ) : isSpeeching || isFetching ? (
          <FaSpinner className="h-16 w-16 animate-spin" />
        ) : (
          <FaMicrophone className="h-16 w-16" />
        )}
      </button>
      {isTranscribing && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 rounded-full w-4 h-4 animate-ping"></div>
      )}
      <p
        className={classNames(
          'text-gray-500 text-center mt-4 transition-all duration-300 ease-in-out',
          {
            'text-blue-500 font-bold': !isTranscribing,
          },
        )}
      >
        {isTranscribing ? (
          <span className="text-blue-500 font-bold">正在识别中，点击停止</span>
        ) : isSpeeching || isFetching ? (
          <span className="text-blue-500 font-bold">正在回答，点击停止</span>
        ) : (
          <span className="text-blue-500 font-bold">点击开始录音</span>
        )}
      </p>
    </div>
  );
}
