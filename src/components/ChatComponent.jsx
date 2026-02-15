import React from "react";
import { Bot, Loader2, Send, Mic, MicOff } from "lucide-react";
import { formatTime } from "../utils/utils";

const ChatComponent = ({
  messages,
  loading,
  input,
  setInput,
  handleKeyPress,
  sendMessage,
  messagesContainerRef,
  toggleVoiceInput,
  isListening,
  isSpeaking,
}) => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
      {/* voice control pending...*/}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Conversation</h3>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Bot className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How can I help?
              </h3>
              <p className="text-gray-500 max-w-md">
                Ask me to create tasks, update them, or manage your to-do list
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : msg.role === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {msg.role === "assistant"
                    ? msg.content
                        .split(/(\*\*.*?\*\*)/g)
                        .map((part, i) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                          ) : (
                            part
                          ),
                        )
                    : msg.content}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              type="text"
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
