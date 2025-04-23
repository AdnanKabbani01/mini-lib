import { Assistant } from "@/components/ui/assistant";

export default function AssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 mr-3 rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">G</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-100">
            Library Assistant
          </h1>
        </div>

        <div className="mb-10">
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Ask our AI assistant powered by Google Gemini about books in our
            library, check availability, or get recommendations.
          </p>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl mb-10 max-w-2xl mx-auto shadow-xl">
            <h2 className="font-medium text-emerald-400 mb-4 text-lg">
              Try asking:
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2 text-emerald-500">•</span>
                "What science fiction books do you have?"
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-emerald-500">•</span>
                "Do you have any books by Jane Austen?"
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-emerald-500">•</span>
                "What are some popular books in the library?"
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-emerald-500">•</span>
                "Tell me about book availability"
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Assistant darkMode={true} />
        </div>
      </div>
    </div>
  );
}
