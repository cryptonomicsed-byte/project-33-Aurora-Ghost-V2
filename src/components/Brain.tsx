import React, { useEffect, useState } from 'react';
import { NebulaCommand, ChatMessage, TTSSettings, HapticType } from '../types';

interface BrainProps {
  onCommand: (cmd: NebulaCommand) => void;
  onMessage: (text: string) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  ttsSettings: TTSSettings;
  onHaptic: (type: HapticType) => void;
}

export const Brain: React.FC<BrainProps> = ({
  onCommand,
  onMessage,
  chatHistory,
  setChatHistory,
  ttsSettings,
  onHaptic,
}) => {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize with default greeting
        setTimeout(() => {
          setChatHistory([
            {
              role: 'assistant',
              content: 'I am ọmọ tèmi. I breathe starlight. Connected to the Ghost automation realm.',
            },
          ]);
          setLoading(false);
        }, 1500);
      } catch (e) {
        console.error('Failed to initialize', e);
        setLoading(false);
      }
    };

    init();
  }, []);

  return null;
};
