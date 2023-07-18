// 当前对话组件
interface CurrentConversationProps {
  currentCompletion: { content: string } | null;
  recognizeText: string;
}

export default function CurrentConversation({
  currentCompletion,
  recognizeText,
}: CurrentConversationProps) {
  return (
    <div>
      <p className="text-blue-500 mb-2 text-center mt-2">{recognizeText}</p>
      {currentCompletion?.content && (
        <div className="mb-4 flex-grow flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2">AI</h2>
          <div className="flex flex-col w-full max-w-lg bg-white rounded shadow-lg overflow-y-auto transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="p-4">
              <div className="text-blue-500 font-bold">
                {currentCompletion.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
