"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Send, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatWithAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you submit your e-waste for collection. What type of e-waste do you have?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // In a real app, this would call an AI API
    // For now, we'll simulate a response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("help")) {
        response =
          "I can help you fill out the form. Just tell me what type of e-waste you have, and I'll guide you through the process."
      } else if (input.toLowerCase().includes("category") || input.toLowerCase().includes("type")) {
        response =
          "E-waste is categorized into: Large household appliances, Small household appliances, IT equipment, Consumer electronics, Lamps and luminaires, Toys, Tools, Medical devices, Monitoring and control instruments, and Automatic dispensers. Which category does your item fall into?"
      } else if (input.toLowerCase().includes("tv") || input.toLowerCase().includes("television")) {
        response =
          "A TV would fall under 'Consumer electronics'. You can select this category in the form and specify it's a television in the description field."
      } else if (input.toLowerCase().includes("computer") || input.toLowerCase().includes("laptop")) {
        response =
          "Computers and laptops fall under 'IT equipment'. You can select this category and specify the type in the description."
      } else if (input.toLowerCase().includes("pickup") || input.toLowerCase().includes("collection")) {
        response =
          "You can select your preferred pickup date in the form. We typically offer pickups on weekdays. Once you submit the form, our team will confirm the exact time with you."
      } else {
        response =
          "I understand you have e-waste to recycle. Could you tell me more about what specific items you have? This will help me guide you through the submission process."
      }

      const assistantMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4 border rounded-md mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${message.role === "assistant" ? "text-green-600" : ""}`}
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse delay-150" />
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse delay-300" />
              <span className="text-xs">AI is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}

