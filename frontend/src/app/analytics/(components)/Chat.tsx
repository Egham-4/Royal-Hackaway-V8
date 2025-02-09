"use client";

import { useChat } from "ai/react";
import {
  Bot,
  Globe,
  LightbulbIcon,
  Sparkles,
  FileText,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Bot className="w-4 h-4" />
              InsighterBot
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>New Chat</DropdownMenuItem>
            <DropdownMenuItem>Clear History</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto pt-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-8">What can I help with?</h1>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Message ChatGPT..."
                value={input}
                onChange={handleInputChange}
                rows={1}
                className="resize-none pr-20 py-3 rounded-xl"
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <Button size="icon" variant="ghost" type="button">
                  <Globe className="w-4 h-4" />
                  <span className="sr-only">Search</span>
                </Button>
                <Button size="icon" variant="ghost" type="button">
                  <LightbulbIcon className="w-4 h-4" />
                  <span className="sr-only">Reason</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" /> Create image
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" /> Summarize text
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <LightbulbIcon className="w-4 h-4" /> Get advice
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Gift className="w-4 h-4" /> Surprise me
              </Button>
              <Button variant="outline" size="sm">
                More
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
