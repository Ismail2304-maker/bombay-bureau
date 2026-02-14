"use client";
import { useState } from "react";

export default function ListenButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = async () => {
    if (!text) return;

    // STOP if already speaking
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);

    try {
      // 🔊 TRY PREMIUM AI VOICE
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("AI voice failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => setSpeaking(false);
      audio.play();

    } catch {
      // 🟡 FALLBACK → browser voice
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onend = () => setSpeaking(false);
      speechSynthesis.speak(utter);
    }
  };

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 text-sm transition ${
        speaking ? "text-white" : "text-gray-400 hover:text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 ${speaking ? "animate-pulse" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
          d="M11 5L6 9H3v6h3l5 4V5z" />
        <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
          d="M15.5 8.5a5 5 0 010 7" />
      </svg>

      <span>{speaking ? "Stop audio" : "Listen"}</span>
    </button>
  );
}