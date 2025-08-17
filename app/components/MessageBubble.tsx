"use client"

import { format } from "date-fns"
import { User, Bot } from "lucide-react"
import type { Message } from "../context/ChatContext"
import TypingIndicator from "./TypingIndicator"

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"
  const isLoading = message.isLoading

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className={`max-w-[70%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`
          p-3 rounded-lg shadow-sm
          ${isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-card text-card-foreground border border-border"}
        `}
        >
          {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>}
        </div>

        <div
          className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{format(message.timestamp, "h:mm a")}</span>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
