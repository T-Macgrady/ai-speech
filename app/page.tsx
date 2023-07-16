import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link className="font-bold text-blue-500 mb-5" href="/AiChat">
        Go to AI Chat
      </Link>

      <Link
        className="font-bold text-blue-500 mb-5"
        href="/SimultaneousInterpretation"
      >
        Go to Simultaneous Interpretation
      </Link>
    </main>
  );
}
