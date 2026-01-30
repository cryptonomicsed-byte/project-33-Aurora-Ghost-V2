import React, { useState } from 'react';
import { ChatMessage, TTSSettings, HapticType } from '../types';

interface InterfaceProps {
  chatHistory: ChatMessage[];
  onSend: (text: string) => void;
  ttsSettings: TTSSettings;
  setTtsSettings: (settings: TTSSettings) => void;
  onHaptic: (type: HapticType) => void;
}

export const Interface: React.FC<InterfaceProps> = ({
  chatHistory,
  onSend,
  ttsSettings,
  setTtsSettings,
  onHaptic,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pointer-events-auto">
        <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'text-blue-100 italic'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Whisper to the void..."
            className="w-full bg-black/40 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white disabled:opacity-0"
          >
            →
          </button>
        </form>
      </div>

      <div className="absolute top-4 left-4 text-white/50 text-xs font-mono pointer-events-none">
        <div>ỌMỌ TÈMI</div>
        <div>{chatHistory.length} messages</div>
      </div>
    </div>
  );
};
