"use client";

import { Brain, Menu, Plus } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#0d0d10]/90 px-4 backdrop-blur-xl md:hidden">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200"
          aria-label="Open menu"
        >
          <Menu size={19} strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
            <Brain size={17} strokeWidth={1.8} />
          </div>

          <span className="text-sm font-semibold text-zinc-100">
            Study Buddy
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="hidden text-xs text-zinc-500 xs:block">
            Online
          </span>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
          aria-label="New chat"
        >
          <Plus size={17} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}