import dynamic from 'next/dynamic';
import Head from 'next/head';

const RealTimeChat = dynamic(() => import('@/components/RealTimeChat'), {
  ssr: false,
});

export default function AiChatPage() {
  return (
    <div>
      <Head>
        <title>Chatgpt 语音 助手</title>
      </Head>
      <RealTimeChat />
    </div>
  );
}
