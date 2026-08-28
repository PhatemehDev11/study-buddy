"use client";
import Sidebar from "@/components/sidebar";
import MobileHeader from "@/components/MobileHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInput from "@/components/ChatInput";
import Chat from "@/components/chat";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
  
          if (!trimmedLine || trimmedLine === "data: [DONE]") {
            continue;
          }
  
          if (!trimmedLine.startsWith("data: ")) {
            continue;
          }
  
          const jsonString = trimmedLine.slice(6);
  
          try {
            const data = JSON.parse(jsonString);
  
            const text =
              data.choices?.[0]?.delta?.content;
  
            if (!text) continue;
  
            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      content: message.content + text,
                    }
                  : message
              )
            );
          } catch (error) {
            console.error(
              "Failed to parse stream chunk:",
              error
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-h-screen min-w-0 flex-1 flex-col">
          <MobileHeader />

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            {messages.length === 0 && <WelcomeScreen />}

            {messages.length > 0 && (
              <Chat messages={messages} isLoading={isLoading} />
            )}
            {error && (
              <div className="mb-3 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="ml-4 text-red-400 transition hover:text-red-200"
                >
                  ×
                </button>
              </div>
            )}

<ChatInput
  onSend={handleSendMessage}
  isLoading={isLoading}
/>
          </div>
        </section>
      </div>
    </main>
  );
}
