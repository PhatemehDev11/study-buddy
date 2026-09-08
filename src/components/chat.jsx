"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function Chat({ messages, isLoading }) {
  const bottomRef = useRef(null);

  const lastMessage = messages[messages.length - 1];

  const isThinking =
    isLoading &&
    lastMessage?.role === "assistant" &&
    !lastMessage.content;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 py-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:300ms]" />
            </div>

            <span className="text-sm text-zinc-500">
              Study Buddy is thinking...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}