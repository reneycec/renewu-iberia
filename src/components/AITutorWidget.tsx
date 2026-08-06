import React, { useState } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, BookOpen, GraduationCap, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { Dictionary } from "../data/translations";

interface AITutorWidgetProps {
  t: Dictionary;
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({ t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "bot",
      text: t.aiGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    t.quickPrompt1,
    t.quickPrompt2,
    t.quickPrompt3,
    t.quickPrompt4,
  ];


  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/llm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "El programa de Renew University consta de 12 cursos teológicos de 6 semanas de duración cada uno. Los cursos cuestan $59 por unidad o $709 por el programa completo con acceso garantizado al aula virtual Moodle.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Container */}
      <div className="bg-white border border-[#D6B858] rounded-xl shadow-lg overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header */}
        <div className="bg-[#1A1A19] text-white p-4 border-b border-[#D6B858] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D6B858] flex items-center justify-center text-white font-bold shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span>Tutor Teológico Inteligente RenewU</span>
                <span className="text-[10px] bg-[#D6B858]/20 text-[#D6B858] px-2 py-0.5 rounded border border-[#D6B858]/30">
                  Gemini AI Powered
                </span>
              </h2>
              <p className="text-xs text-gray-300">Asistencia académica, dudas sobre cursos y acreditación Moodle</p>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-gray-400 hover:text-[#D6B858] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar Chat</span>
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B858]" /> Preguntas sugeridas:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-white hover:bg-[#D6B858]/10 text-gray-700 hover:text-[#725c00] border border-gray-200 hover:border-[#D6B858] px-2.5 py-1 rounded-full transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "user"
                    ? "bg-[#1A1A19] text-[#D6B858]"
                    : "bg-[#D6B858] text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#1A1A19] text-white rounded-tr-none shadow-xs"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs whitespace-pre-line"
                }`}
              >
                <p>{msg.text}</p>
                <span className={`block text-[10px] mt-2 ${msg.sender === "user" ? "text-gray-400" : "text-gray-400"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium animate-pulse">
              <Bot className="w-5 h-5 text-[#D6B858]" />
              <span>El Tutor Teológico está redactando la respuesta...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu consulta académica o teológica..."
            className="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-[#D6B858] hover:bg-[#c3a447] text-white font-bold p-3 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
