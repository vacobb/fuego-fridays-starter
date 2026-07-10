/**
 * ChaseChat — a slide-up chat panel for Chase, the AI helper.
 *
 * Opens when the user clicks "Yes, help me" from the IdleHelper popup.
 * Simulates Chase responding with a short typing delay.
 */

import { useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────── */

type Role = "user" | "chase";

interface ChatMessage {
  id: string;
  role: Role;
  text: string;
}

/* ── Canned Chase responses ─────────────────────────────────────── */

const CHASE_RESPONSES = [
  "Happy to help! What are you working on right now?",
  "Got it! Let me think through that with you. Can you tell me a bit more?",
  "Sure thing! Here's how I'd approach that…",
  "Great question. Based on your lesson plan today, I'd suggest starting with the color vocabulary — kids tend to connect with those faster.",
  "I noticed you have an open gap at 11:45. Want me to draft a quick review activity for that window?",
  "That sounds like a great idea. Want me to write up some example sentences you can use?",
  "I've seen that work well with kindergarten groups. Want a variation that works for older kids too?",
  "No problem at all! Is there anything else I can help with before your next class?",
];

let responseIndex = 0;
function nextResponse() {
  const r = CHASE_RESPONSES[responseIndex % CHASE_RESPONSES.length];
  responseIndex++;
  return r;
}

/* ── Component ──────────────────────────────────────────────────── */

interface ChaseChatProps {
  open: boolean;
  onClose: () => void;
  /** Path to Chase's photo — passed through from IdleHelper config. */
  imageSrc: string;
}

export function ChaseChat({ open, onClose, imageSrc }: ChaseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "chase-0",
      role: "chase",
      text: "Hey! I noticed you've been idle for a bit. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [chaseTyping, setChaseTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input whenever the panel opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open, minimized]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChaseTyping(true);

    // Simulate Chase typing for 1–2 seconds
    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      const chaseMsg: ChatMessage = {
        id: `chase-${Date.now()}`,
        role: "chase",
        text: nextResponse(),
      };
      setMessages((prev) => [...prev, chaseMsg]);
      setChaseTyping(false);
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden",
        "rounded-2xl border border-border bg-card shadow-2xl",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
        minimized ? "h-14" : "h-[480px]",
        "transition-[height] duration-200",
      )}
    >
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Avatar size="sm">
          <AvatarImage src={imageSrc} alt="Chase" className="object-cover object-top" />
          <AvatarFallback className="bg-fuego-100 text-fuego-700 text-xs">CH</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-none">Chase</p>
          <p className={cn(
            "mt-0.5 text-[11px]",
            chaseTyping ? "text-fuego-500" : "text-muted-foreground",
          )}>
            {chaseTyping ? "Typing…" : "AI Helper · Always here"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? "Expand chat" : "Minimize chat"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      {!minimized && (
        <>
          <MessageScrollerProvider>
            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 px-4 py-4">
                  {messages.map((msg) => (
                    <MessageScrollerItem key={msg.id}>
                      {msg.role === "chase" ? (
                        <Message align="start">
                          <MessageAvatar>
                            <Avatar size="sm">
                              <AvatarImage src={imageSrc} alt="Chase" className="object-cover object-top" />
                              <AvatarFallback className="bg-fuego-100 text-fuego-700 text-[10px]">CH</AvatarFallback>
                            </Avatar>
                          </MessageAvatar>
                          <MessageContent>
                            <MessageHeader>Chase</MessageHeader>
                            <Bubble variant="secondary">
                              <BubbleContent>{msg.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      ) : (
                        <Message align="end">
                          <MessageContent>
                            <Bubble variant="default" align="end">
                              <BubbleContent>{msg.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      )}
                    </MessageScrollerItem>
                  ))}

                  {/* Typing indicator */}
                  {chaseTyping && (
                    <MessageScrollerItem scrollAnchor>
                      <Message align="start">
                        <MessageAvatar>
                          <Avatar size="sm">
                            <AvatarImage src={imageSrc} alt="Chase" className="object-cover object-top" />
                            <AvatarFallback className="bg-fuego-100 text-fuego-700 text-[10px]">CH</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble variant="secondary">
                            <BubbleContent>
                              <TypingDots />
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}

                  {/* Scroll anchor when not typing */}
                  {!chaseTyping && (
                    <MessageScrollerItem scrollAnchor className="h-0" />
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          {/* ── Compose bar ── */}
          <div className="shrink-0 border-t border-border p-3">
            <InputGroup>
              <InputGroupTextarea
                ref={textareaRef}
                placeholder="Message Chase…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="max-h-24 min-h-0 py-2 text-sm"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  onClick={sendMessage}
                  disabled={!input.trim() || chaseTyping}
                  aria-label="Send message"
                  className={cn(
                    "transition-colors",
                    input.trim() && !chaseTyping
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "",
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Typing dots animation ──────────────────────────────────────── */

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-0.5" aria-label="Chase is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "800ms" }}
        />
      ))}
    </span>
  );
}
