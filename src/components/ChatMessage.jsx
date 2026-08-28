import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Brain, User } from "lucide-react";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Brain size={20} />
        </div>
      )}

      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-violet-500 text-white"
            : "border border-white/10 bg-zinc-900/70 text-zinc-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="max-w-none break-words text-[15px] leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0">{children}</p>
                ),

                h1: ({ children }) => (
                  <h1 className="mb-4 mt-2 text-2xl font-bold text-white">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="mb-3 mt-5 text-xl font-semibold text-white">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-lg font-semibold text-white">
                    {children}
                  </h3>
                ),

                ul: ({ children }) => (
                  <ul className="mb-4 ml-5 list-disc space-y-1">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="mb-4 ml-5 list-decimal space-y-1">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="pl-1">{children}</li>
                ),

                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),

                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes("language-");

                  if (!isBlock) {
                    return (
                      <code
                        className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-violet-300"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      className="block overflow-x-auto whitespace-pre p-4 font-mono text-[13px] leading-6 text-zinc-200"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/50">
                    {children}
                  </pre>
                ),

                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-2 border-violet-500 pl-4 text-zinc-400">
                    {children}
                  </blockquote>
                ),

                hr: () => (
                  <hr className="my-5 border-white/10" />
                ),

                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
          <User size={20} />
        </div>
      )}
    </div>
  );
}