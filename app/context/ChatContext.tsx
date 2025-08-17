"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  isLoading?: boolean
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  isLoading: boolean
  username: string
  hasUploadedFiles: boolean
  isUploadingFiles: boolean
}

type ChatAction =
  | { type: "CREATE_CHAT" }
  | { type: "SELECT_CHAT"; payload: string }
  | { type: "DELETE_CHAT"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Omit<Message, "id"> | Message } }
  | { type: "UPDATE_MESSAGE"; payload: { chatId: string; messageId: string; content: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_CHATS"; payload: Chat[] }
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_FILES_UPLOADED"; payload: boolean }
  | { type: "SET_UPLOADING_FILES"; payload: boolean }

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  isLoading: false,
  username: "",
  hasUploadedFiles: false,
  isUploadingFiles: false,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "CREATE_CHAT": {
      const newChat: Chat = {
        id: uuidv4(),
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return {
        ...state,
        chats: [newChat, ...state.chats],
        activeChat: newChat,
      }
    }
    case "SELECT_CHAT": {
      const chat = state.chats.find((c) => c.id === action.payload)
      return {
        ...state,
        activeChat: chat || null,
      }
    }
    case "DELETE_CHAT": {
      const updatedChats = state.chats.filter((c) => c.id !== action.payload)
      const newActiveChat =
        state.activeChat?.id === action.payload ? (updatedChats.length > 0 ? updatedChats[0] : null) : state.activeChat
      return {
        ...state,
        chats: updatedChats,
        activeChat: newActiveChat,
      }
    }
    case "ADD_MESSAGE": {
      const message: Message = {
        ...action.payload.message,
        id: (action.payload.message as Message).id || uuidv4(),
      }

      const updatedChats = state.chats.map((chat) => {
        if (chat.id === action.payload.chatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date(),
            title:
              chat.messages.length === 0 && message.sender === "user"
                ? message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
                : chat.title,
          }
          return updatedChat
        }
        return chat
      })

      return {
        ...state,
        chats: updatedChats,
        activeChat:
          state.activeChat?.id === action.payload.chatId
            ? updatedChats.find((c) => c.id === action.payload.chatId) || state.activeChat
            : state.activeChat,
      }
    }
    case "UPDATE_MESSAGE": {
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === action.payload.chatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === action.payload.messageId ? { ...msg, content: action.payload.content, isLoading: false } : msg,
            ),
            updatedAt: new Date(),
          }
        }
        return chat
      })

      return {
        ...state,
        chats: updatedChats,
        activeChat:
          state.activeChat?.id === action.payload.chatId
            ? updatedChats.find((c) => c.id === action.payload.chatId) || state.activeChat
            : state.activeChat,
      }
    }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "LOAD_CHATS":
      return {
        ...state,
        chats: action.payload,
        activeChat: action.payload.length > 0 ? action.payload[0] : null,
      }
    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload.toLowerCase(),
      }
    case "SET_FILES_UPLOADED":
      return {
        ...state,
        hasUploadedFiles: action.payload,
      }
    case "SET_UPLOADING_FILES":
      return {
        ...state,
        isUploadingFiles: action.payload,
      }
    default:
      return state
  }
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  sendMessage: (content: string) => Promise<void>
  uploadFiles: (files: FileList) => Promise<boolean>
} | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  useEffect(() => {
    const savedChats = localStorage.getItem("chatbot-chats")
    const savedUsername = localStorage.getItem("chatbot-username")
    const savedFilesUploaded = localStorage.getItem("chatbot-files-uploaded")

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        dispatch({ type: "LOAD_CHATS", payload: parsedChats })
      } catch (error) {
        console.error("Error loading chats from localStorage:", error)
      }
    }

    if (savedUsername) {
      dispatch({ type: "SET_USERNAME", payload: savedUsername })
    }

    if (savedFilesUploaded === "true") {
      dispatch({ type: "SET_FILES_UPLOADED", payload: true })
    }
  }, [])

  useEffect(() => {
    if (state.chats.length > 0) {
      localStorage.setItem("chatbot-chats", JSON.stringify(state.chats))
    }
  }, [state.chats])

  useEffect(() => {
    if (state.username) {
      localStorage.setItem("chatbot-username", state.username)
    }
  }, [state.username])

  useEffect(() => {
    localStorage.setItem("chatbot-files-uploaded", state.hasUploadedFiles.toString())
  }, [state.hasUploadedFiles])

  const uploadFiles = async (files: FileList): Promise<boolean> => {
    if (!state.username || files.length === 0) return false

    dispatch({ type: "SET_UPLOADING_FILES", payload: true })

    try {
      const formData = new FormData()
      formData.append("username", state.username)

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i])
      }

      const uploadUrl =
        process.env.NEXT_PUBLIC_FILE_UPLOAD_WEBHOOK_URL || "http://localhost:5678/webhook-test/upload-files"

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        dispatch({ type: "SET_FILES_UPLOADED", payload: true })
        return true
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      return false
    } finally {
      dispatch({ type: "SET_UPLOADING_FILES", payload: false })
    }
  }

  const sendMessage = async (content: string) => {
    if (!state.activeChat) return

    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        chatId: state.activeChat.id,
        message: {
          content,
          sender: "user",
          timestamp: new Date(),
        },
      },
    })

    const loadingMessageId = uuidv4()
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        chatId: state.activeChat.id,
        message: {
          id: loadingMessageId,
          content: "",
          sender: "agent",
          timestamp: new Date(),
          isLoading: true,
        },
      },
    })

    try {
      const baseWebhookUrl =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://your-n8n-webhook-url.com/webhook/chatv3"

      const webhookUrl = new URL(baseWebhookUrl)
      webhookUrl.searchParams.append("user_query", content)
      webhookUrl.searchParams.append("username", state.username)

      const response = await fetch(webhookUrl, { method: "GET" })
      if (!response.ok) throw new Error("Failed to get response from agent")

      const data = await response.json()
      let agentResponse = "Sorry, I could not process your request."
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        agentResponse = data[0].output
      } else if (data.output) {
        agentResponse = data.output
      } else if (data.response || data.message) {
        agentResponse = data.response || data.message
      }

      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          chatId: state.activeChat.id,
          messageId: loadingMessageId,
          content: agentResponse,
        },
      })
    } catch (error) {
      console.error("Error sending message:", error)

      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          chatId: state.activeChat.id,
          messageId: loadingMessageId,
          content: "Sorry, I encountered an error while processing your request. Please try again.",
        },
      })
    }
  }

  return <ChatContext.Provider value={{ state, dispatch, sendMessage, uploadFiles }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
