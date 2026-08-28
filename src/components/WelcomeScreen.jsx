import { Brain, Calculator, FileText } from "lucide-react";

const quickActions = [
  {
    icon: Brain,
    title: "Explain a topic",
    description: "Understand difficult concepts",
  },
  {
    icon: Calculator,
    title: "Solve a problem",
    description: "Work through a problem step by step",
  },
  {
    icon: FileText,
    title: "Summarize",
    description: "Turn your notes into key points",
  },
];

export default function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      {/* Hero Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/10 text-violet-300 shadow-[0_0_50px_rgba(139,92,246,0.12)]">
        <Brain size={30} strokeWidth={1.6} />
      </div>

      {/* Heading */}
      <h2 className="max-w-xl text-center text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
        What are you learning today?
      </h2>

      <p className="mt-4 max-w-md text-center text-sm leading-6 text-zinc-500">
        Ask me anything, solve problems, understand difficult concepts,
        or organize your study notes.
      </p>

      {/* Quick Actions */}
      <div className="mt-9 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.045]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-violet-300 transition-colors group-hover:bg-violet-500/10">
                <Icon size={18} strokeWidth={1.7} />
              </div>

              <p className="text-sm font-medium text-zinc-200">
                {action.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}