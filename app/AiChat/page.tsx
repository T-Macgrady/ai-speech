// import RealTimeChat from '@/components/RealTimeChat';

import dynamic from 'next/dynamic';

const RealTimeChat = dynamic(() => import('@/components/RealTimeChat'), {
  ssr: false,
});

export default function AiChatPage() {
  return (
    <div>
      <RealTimeChat />
    </div>
  );
}
