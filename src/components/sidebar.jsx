"use client";

import {
  Brain,
  Plus,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) {
  const [editingConversationId, setEditingConversationId] =
    useState(null);

  const [editingTitle, setEditingTitle] = useState("");

  const startEditing = (conversation) => {
    setEditingConversationId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const cancelEditing = () => {
    setEditingConversationId(null);
    setEditingTitle("");
  };

  const saveEditing = () => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      cancelEditing();
      return;
    }

    onRenameConversation(
      editingConversationId,
      trimmedTitle
    );

    cancelEditing();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditing();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-[#0d0d10] p-4">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Brain size={20} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="text-sm font-semibold">
            Study Buddy
          </h1>

          <p className="text-xs text-zinc-500">
            Your AI study partner
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
      >
        <Plus size={17} strokeWidth={2} />
        New Chat
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
          Recent
        </p>

        <div className="space-y-1">
          {conversations.length === 0 ? (
            <p className="px-2 py-2 text-xs text-zinc-600">
              No conversations yet
            </p>
          ) : (
            conversations.map((conversation) => {
              const isEditing =
                editingConversationId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-1 rounded-lg transition ${activeConversationId === conversation.id
                      ? "bg-white/[0.08]"
                      : "hover:bg-white/[0.05]"
                    }`}
                >
                  {isEditing ? (
                    <div className="flex min-w-0 flex-1 items-center gap-1 px-2 py-1.5">
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(e) =>
                          setEditingTitle(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-zinc-200 outline-none focus:border-violet-400/40"
                      />

                      <button
                        type="button"
                        onClick={saveEditing}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-emerald-400"
                        title="Save"
                        aria-label="Save conversation name"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-zinc-300"
                        title="Cancel"
                        aria-label="Cancel editing"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectConversation(
                            conversation.id
                          )
                        }
                        className={`flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left text-sm ${activeConversationId ===
                            conversation.id
                            ? "text-zinc-200"
                            : "text-zinc-400 group-hover:text-zinc-200"
                          }`}
                      >
                        <MessageSquare
                          size={15}
                          strokeWidth={1.7}
                          className="shrink-0 text-zinc-600"
                        />

                        <span className="truncate">
                          {conversation.title}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          startEditing(conversation)
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-600 opacity-0 transition hover:bg-white/10 hover:text-zinc-300 group-hover:opacity-100"
                        title="Rename conversation"
                        aria-label="Rename conversation"
                      >
                        <Pencil
                          size={14}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteConversation(
                            conversation.id
                          )
                        }
                        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                        title="Delete conversation"
                        aria-label="Delete conversation"
                      >
                        <Trash2
                          size={14}
                          strokeWidth={1.8}
                        />
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
        <p className="text-xs font-medium text-zinc-300">
          Study Buddy
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-600">
          Learn smarter with your personal AI assistant.
        </p>
      </div>
    </aside>
  );
}