import { Brain, Plus, MessageSquare } from "lucide-react";


const recentChats = [
  "JavaScript basics",
  "Physics — Chapter 3",
  "Study plan",
];

export default function Sidebar({ onNewChat }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0d0d10] p-4 md:flex md:flex-col">
   
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Brain size={20} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="text-sm font-semibold">Study Buddy</h1>
          <p className="text-xs text-zinc-500">
            Your AI study partner
          </p>
        </div>
      </div>


      <button
        type="button"
        onClick={onNewChat}
        className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">

        <Plus size={17} strokeWidth={2} />
        New Chat
      </button>
    
      <div>
        <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
          Recent
        </p>

        <div className="space-y-1">
          {recentChats.map((chat) => (
            <button
              key={chat}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
            >
              <MessageSquare
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-zinc-600"
              />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>
      </div>

   
      <div className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
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
