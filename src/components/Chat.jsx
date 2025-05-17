import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react'; // Icon for chat toggle

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="flex-1 p-6 relative">
      <div
        className={`editorContent bg-gray-700 p-6 rounded-lg shadow-md fixed bottom-3 right-6 transition-all ${
          isChatOpen ? 'w-96 h-96' : 'w-16 h-16'
        }`}
      >
        <button
          onClick={toggleChat}
          className="absolute -top-4 -right-4 p-3 bg-blue-600 rounded-full shadow-md hover:bg-blue-500"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        {isChatOpen && (
          <>
            {/* Chat Header */}
            <h2 className="text-xl font-bold mb-2">Chat Page</h2>
            <div className="chatBox bg-gray-500 flex-1 p-4 rounded-md overflow-y-auto">
              <p className="text-gray-300">Chat messages will appear here...</p>
            </div>

            {/* Chat Controls */}
            <div className="flex mt-4 gap-4">
              <input
                type="text"
                placeholder="Type your message"
                className="flex-1 p-3 rounded-md bg-gray-800 text-white focus:outline-none"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
