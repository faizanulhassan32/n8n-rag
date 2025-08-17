"use client"

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="text-sm text-muted-foreground mr-2">AI is typing</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
      </div>
    </div>
  )
}
