"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Menu, Sparkles } from "lucide-react"
import { useChat } from "../context/ChatContext"
import MessageBubble from "./MessageBubble"

interface ChatAreaProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isMobile: boolean
}

const SUGGESTION_QUESTIONS = [
  "What are the key points in my documents?",
  "Can you summarize the main topics?",
  "Help me find specific information",
  "What insights can you provide from my files?",
]

export default function ChatArea({ isSidebarOpen, onToggleSidebar, isMobile }: ChatAreaProps) {
  const { state, sendMessage, dispatch } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.activeChat?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSubmitting || !state.activeChat) return

    setIsSubmitting(true)
    const message = inputValue.trim()
    setInputValue("")

    try {
      await sendMessage(message)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuggestionClick = async (question: string) => {
    if (!state.activeChat) {
      dispatch({ type: "CREATE_CHAT" })
    }

    setIsSubmitting(true)
    try {
      await sendMessage(question)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  const showWelcomeScreen =
    !state.username || !state.hasUploadedFiles || !state.activeChat || state.activeChat.messages.length === 0
  const canChat = state.username && state.hasUploadedFiles

  return (
    <div
      className={`
      flex-1 flex flex-col h-full
      ${isMobile ? "w-full" : ""}
      ${!isMobile && isSidebarOpen ? "ml-0" : ""}
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {(isMobile || !isSidebarOpen) && (
            <button onClick={onToggleSidebar} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div>
            <h2 className="font-semibold text-foreground font-work-sans">
              {state.activeChat?.title || "AI Assistant"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {state.activeChat?.messages.length ? `${state.activeChat.messages.length} messages` : "Ready to help you"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {showWelcomeScreen ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>

              {!state.username ? (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-4 font-work-sans">Welcome to AI Assistant</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Please set your username in the sidebar to get started with document-based conversations.
                  </p>
                </>
              ) : !state.hasUploadedFiles ? (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-4 font-work-sans">Upload Your Documents</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Upload your documents in the sidebar to start having intelligent conversations about your content.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-4 font-work-sans">Ready to Chat!</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Your documents are ready. Start a conversation by asking a question or try one of these suggestions:
                  </p>

                  <div className="grid grid-cols-1 gap-3 text-sm mb-6">
                    {SUGGESTION_QUESTIONS.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(question)}
                        disabled={isSubmitting}
                        className="p-3 bg-muted hover:bg-accent rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <p className="font-medium text-foreground">{question}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 bg-muted rounded-lg text-left">
                  <p className="font-medium text-foreground mb-1">💡 Document Analysis</p>
                  <p className="text-muted-foreground">Get insights from your uploaded files</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-left">
                  <p className="font-medium text-foreground mb-1">🔍 Smart Search</p>
                  <p className="text-muted-foreground">Find specific information quickly</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-left">
                  <p className="font-medium text-foreground mb-1">💬 Natural Conversation</p>
                  <p className="text-muted-foreground">Chat naturally about your content</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {state.activeChat?.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {canChat && state.activeChat && (
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your documents..."
                className="w-full p-3 pr-12 bg-input border border-border rounded-lg 
                         text-foreground placeholder-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         resize-none min-h-[48px] max-h-[120px]"
                rows={1}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isSubmitting}
              className="p-3 bg-primary hover:bg-primary/90 disabled:bg-muted 
                       disabled:text-muted-foreground text-primary-foreground 
                       rounded-lg transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      )}
    </div>
  )
}
