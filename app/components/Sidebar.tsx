"use client"

import type React from "react"

import { useState } from "react"
import { Plus, MessageSquare, Trash2, X, Upload, User, FileText } from "lucide-react"
import { useChat } from "../context/ChatContext"
import { format } from "date-fns"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isMobile: boolean
}

export default function Sidebar({ isOpen, onToggle, isMobile }: SidebarProps) {
  const { state, dispatch } = useChat()
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"chats" | "upload">("chats")

  const handleNewChat = () => {
    dispatch({ type: "CREATE_CHAT" })
    if (isMobile) {
      onToggle()
    }
  }

  const handleSelectChat = (chatId: string) => {
    dispatch({ type: "SELECT_CHAT", payload: chatId })
    if (isMobile) {
      onToggle()
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: "DELETE_CHAT", payload: chatId })
  }

  if (isMobile && !isOpen) {
    return null
  }

  return (
    <>
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onToggle} />}

      <div
        className={`
        ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-80 h-full bg-sidebar border-r border-sidebar-border
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-sidebar-foreground font-work-sans">AI Assistant</h1>
            {isMobile && (
              <button onClick={onToggle} className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            )}
          </div>

          <div className="flex bg-sidebar-primary rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "chats"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chats
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          {activeTab === "chats" && (
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 p-3 bg-sidebar-accent hover:bg-sidebar-accent/80 
                       text-sidebar-accent-foreground rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {activeTab === "chats" ? (
            <>
              <h2 className="text-sm font-semibold text-sidebar-foreground mb-3 uppercase tracking-wide">
                Recent Chats
              </h2>

              {state.chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No chats yet. Start a new conversation!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {state.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`
                        group relative p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          state.activeChat?.id === chat.id
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        }
                      `}
                      onClick={() => handleSelectChat(chat.id)}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{chat.title}</p>
                          <p className="text-xs opacity-70 mt-1">{format(chat.updatedAt, "MMM d, h:mm a")}</p>
                          {chat.messages.length > 0 && (
                            <p className="text-xs opacity-60 mt-1 truncate">
                              {chat.messages[chat.messages.length - 1].content}
                            </p>
                          )}
                        </div>
                      </div>

                      {(hoveredChat === chat.id || state.activeChat?.id === chat.id) && (
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="absolute top-2 right-2 p-1.5 rounded-md 
                                   hover:bg-destructive hover:text-destructive-foreground
                                   transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <UploadTab />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {state.username && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-sidebar-primary rounded-lg">
              <User className="w-4 h-4 text-sidebar-foreground" />
              <span className="text-sm text-sidebar-foreground">User: {state.username}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">Powered by AI • v1.0.0</p>
        </div>
      </div>
    </>
  )
}

function UploadTab() {
  const { state, dispatch, uploadFiles } = useChat()
  const [username, setUsername] = useState(state.username)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      dispatch({ type: "SET_USERNAME", payload: username.trim() })
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles && state.username) {
      const success = await uploadFiles(selectedFiles)
      if (success) {
        setSelectedFiles(null)
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const acceptedTypes = ".txt,.docx,.pdf"

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-sidebar-foreground mb-3 uppercase tracking-wide">Document Upload</h2>

      {!state.username ? (
        <div className="space-y-3">
          <p className="text-sm text-sidebar-foreground">Enter your username to get started:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="flex-1 p-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
            />
            <button
              onClick={handleUsernameSubmit}
              disabled={!username.trim()}
              className="px-3 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg transition-colors"
            >
              Set
            </button>
          </div>
        </div>
      ) : !state.hasUploadedFiles ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">Username: {state.username}</span>
          </div>

          <p className="text-sm text-sidebar-foreground">Upload your documents to start chatting:</p>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-sidebar-foreground mb-2">Drag & drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mb-3">Supports: TXT, DOCX, PDF files</p>
            <input
              type="file"
              multiple
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>

          {selectedFiles && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-sidebar-foreground">Selected Files:</p>
              <div className="space-y-1">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-sidebar-primary rounded-lg">
                    <FileText className="w-4 h-4 text-sidebar-foreground" />
                    <span className="text-sm text-sidebar-foreground truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                disabled={state.isUploadingFiles}
                className="w-full p-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg transition-colors font-medium"
              >
                {state.isUploadingFiles ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Files Uploaded Successfully!</p>
              <p className="text-xs text-green-600 dark:text-green-500">
                You can now start chatting with your documents.
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_FILES_UPLOADED", payload: false })}
            className="w-full p-2 text-sm bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground rounded-lg transition-colors"
          >
            Upload New Files
          </button>
        </div>
      )}
    </div>
  )
}
