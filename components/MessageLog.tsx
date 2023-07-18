import { Message } from '@/hooks/useMessageLog';
import classNames from 'classnames';

// 历史记录组件
interface MessageLogProps {
  messageLog?: Message[];
}

export default function MessageLog({ messageLog = [] }: MessageLogProps) {
  return (
    <div
      className={classNames(
        'md:col-span-1 bg-gray-100 py-4 flex flex-col items-center transition-all duration-300 ease-in-out',
        {
          'w-0 scale-0': messageLog.length <= 1,
        },
      )}
    >
      <h2 className="text-2xl font-bold mb-2 text-center">历史记录</h2>

      <ul className="w-full max-w-lg border rounded-lg overflow-hidden divide-y divide-gray-300">
        {[...messageLog.slice(1)].reverse().map((message) => (
          <li
            key={message.created}
            className={classNames(
              'px-4 py-2 last:border-0 flex items-center transition-all duration-300 ease-in-out',
              {
                'text-blue-500': message.role === 'user',
                'text-gray-500': message.role !== 'user',
              },
            )}
          >
            <span className="font-bold mr-2">
              {message.role === 'user' ? 'U：' : 'AI：'}
            </span>
            <span className="flex-grow">{message.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
