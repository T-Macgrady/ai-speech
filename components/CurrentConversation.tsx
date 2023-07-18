interface CurrentConversationProps {
  currentCompletion: { content: string } | null;
  recognizeText: string;
}

export default function CurrentConversation({
  currentCompletion,
  recognizeText,
}: CurrentConversationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-lg">
        {currentCompletion?.content && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
            <div className="px-6 py-4">
              <p className="text-yellow-400 text-base">
                {currentCompletion.content}
              </p>
            </div>
          </div>
        )}
        <p className="text-blue-500 text-center text-lg">{recognizeText}</p>
      </div>
    </div>
  );
}
