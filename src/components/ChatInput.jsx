"use client";

import { Send, Paperclip } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend , isLoading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
  
    e.preventDefault();
    if (isLoading) return;

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full pb-5">
      <div className="rounded-2xl border border-white/[0.09] bg-[#111114] p-2 shadow-2xl shadow-black/20 transition-all duration-200 focus-within:border-violet-400/30">
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask your study buddy anything..."
          rows={1}
          className="max-h-32 min-h-12 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600"
        />

        <div className="flex items-center justify-between px-2 pb-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
            title="Attach file"
          >
            <Paperclip size={16} strokeWidth={1.7} />
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-zinc-700 sm:block">
              Enter to send · Shift + Enter for new line
            </span>

            <button
  type="submit"
  disabled={!message.trim() || isLoading}
  className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-30"
>
  {isLoading ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  ) : (
    <Send size={16} strokeWidth={2} />
  )}
</button>
          </div>
        </div>
      </div>
    </form>
  );
}