"use client";

import Sidebar from "@/components/sidebar";
import MobileHeader from "@/components/MobileHeader";
import ChatInput from "@/components/ChatInput";
import Chat from "@/components/chat";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "study-buddy-conversations";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const abortController = useRef(null);

  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);

    if (!savedConversations) return;

    try {
      const parsedConversations = JSON.parse(savedConversations);

      setConversations(parsedConversations);

      if (parsedConversations.length > 0) {
        const latestConversation = parsedConversations[0];

        setActiveConversationId(latestConversation.id);
        setMessages(latestConversation.messages || []);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const updateConversation = (conversationId, updatedMessages) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: updatedMessages,
            }
          : conversation
      )
    );
  };

  const handleSendMessage = async (content) => {
    if (isLoading) return;

    setError("");

    const userMessage = {
      id: Date.now(),
      role: "user",
      content,
    };

    let conversationId = activeConversationId;
    let previousMessages = messages;

    // اگر چت جدید است، conversation را می‌سازیم
    if (!conversationId) {
      conversationId = Date.now();

      const newConversation = {
        id: conversationId,
        title: content.length > 40 ? `${content.slice(0, 40)}...` : content,
        messages: [],
      };

      setConversations((currentConversations) => [
        newConversation,
        ...currentConversations,
      ]);

      setActiveConversationId(conversationId);

      previousMessages = [];
    }

    const updatedMessages = [...previousMessages, userMessage];

    setMessages(updatedMessages);
    updateConversation(conversationId, updatedMessages);

    setIsLoading(true);

    const controller = new AbortController();
    abortController.current = controller;

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
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Failed to get AI response");
      }

      if (!response.body) {
        throw new Error("No response body received.");
      }

      const assistantId = Date.now() + 1;

      const assistantMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      const messagesWithAssistant = [...updatedMessages, assistantMessage];

      setMessages(messagesWithAssistant);
      updateConversation(conversationId, messagesWithAssistant);

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

            const text = data.choices?.[0]?.delta?.content || "";

            if (!text) continue;

            assistantContent += text;

            const currentMessages = [
              ...updatedMessages,
              {
                ...assistantMessage,
                content: assistantContent,
              },
            ];

            setMessages(currentMessages);

            updateConversation(conversationId, currentMessages);
          } catch {
            // Ignore malformed stream chunks.
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Generation stopped");
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

  const handleNewChat = () => {
    abortController.current?.abort();
    abortController.current = null;

    setMessages([]);
    setActiveConversationId(null);
    setIsLoading(false);
    setError("");
  };

  const handleRenameConversation = (conversationId, newTitle) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title: newTitle,
            }
          : conversation
      )
    );
  };

  const handleDeleteConversation = (conversationId) => {
    if (isLoading) return;

    setConversations((currentConversations) =>
      currentConversations.filter(
        (conversation) => conversation.id !== conversationId
      )
    );

    if (activeConversationId === conversationId) {
      setMessages([]);
      setActiveConversationId(null);
      setError("");
    }
  };

  const handleSelectConversation = (conversationId) => {
    if (isLoading) return;

    const conversation = conversations.find(
      (conversation) => conversation.id === conversationId
    );

    if (!conversation) return;

    setActiveConversationId(conversationId);
    setMessages(conversation.messages || []);
    setError("");
  };

  return (
    <main className="h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-[#0d0d0f] lg:block">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
      </aside>

      <section className="h-screen min-w-0 lg:ml-64">
        <div className="flex h-full flex-col">
          <MobileHeader />

          <div className="min-h-0 flex-1">
            <div className="mx-auto flex h-full w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
              <Chat messages={messages} isLoading={isLoading} />

              {error && (
                <div className="mb-3 flex shrink-0 items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
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
          </div>
        </div>
      </section>
    </main>
  );
}
