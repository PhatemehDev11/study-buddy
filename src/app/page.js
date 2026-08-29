"use client";

import Sidebar from "@/components/sidebar";
import MobileHeader from "@/components/MobileHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInput from "@/components/ChatInput";
import Chat from "@/components/chat";
import { useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const abortController = useRef(null);

  const handleSendMessage = async (content) => {
    if (isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      abortController.current = controller;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      if (!response.body) {
        throw new Error("No response body received.");
      }

      const assistantId = Date.now() + 1;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (!trimmedLine) continue;

          if (trimmedLine === "data: [DONE]") {
            continue;
          }

          if (!trimmedLine.startsWith("data: ")) {
            continue;
          }

          try {
            const data = JSON.parse(trimmedLine.slice(6));

            const text = data.choices?.[0]?.delta?.content;

            if (!text) continue;

            assistantContent += text;

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      content: assistantContent,
                    }
                  : message
              )
            );
          } catch {
            // Ignore malformed/incomplete stream chunks.
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }
  };

  const handleStop = () => {
    abortController.current?.abort();
  };

  return (
<main className="min-h-screen bg-[#09090b] text-zinc-100">
  <div className="min-h-screen">
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-[#0d0d0f] lg:flex">
    <Sidebar />
    </aside>
    

    <section className="min-h-screen min-w-0 lg:ml-64">
      <MobileHeader />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {messages.length === 0 && <WelcomeScreen />}
  
          {messages.length > 0 && (
            <Chat
              messages={messages}
              isLoading={isLoading}
            />
          )}
  
          {error && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              <span>{error}</span>
  
              <button
                type="button"
                onClick={() => setError("")}
                className="ml-4 text-red-400 transition hover:text-red-200"
              >
                ×
              </button>
            </div>
          )}
  
          <ChatInput
            onSend={handleSendMessage}
            onStop={handleStop}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  </main>
  );
}