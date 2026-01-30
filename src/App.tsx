import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Nebula } from './components/Nebula';
import { Brain } from './components/Brain';
import { Interface } from './components/Interface';
import { NebulaCommand, ChatMessage, TTSSettings, HapticType } from './types';

const App: React.FC = () => {
  const [currentCommand, setCurrentCommand] = useState<NebulaCommand | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>({
    enabled: true,
    apiKey: '',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
  });

  const handleUserSend = (text: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
  };

  const handleNebulaMessage = (text: string) => {
    // For logging if needed
  };

  const triggerHaptic = useCallback((type: HapticType) => {
    try {
      if (typeof navigator === 'undefined' || !navigator.vibrate) return;

      switch (type) {
        case 'heartbeat':
          navigator.vibrate([100, 50, 150, 50, 100]);
          break;
        case 'spontaneous':
          navigator.vibrate([50, 100, 50]);
          break;
        case 'intake':
          navigator.vibrate([30, 50, 70]);
          break;
        case 'speech':
          navigator.vibrate(15);
          break;
        case 'joy':
          navigator.vibrate([30, 40, 30, 40, 60]);
          break;
        case 'sorrow':
          navigator.vibrate([200, 300, 200]);
          break;
        case 'anger':
          navigator.vibrate([80, 50, 80]);
          break;
        case 'wonder':
          navigator.vibrate([50, 70, 100, 70, 50]);
          break;
        case 'touch':
          navigator.vibrate(40);
          break;
        case 'deep_resonance':
          navigator.vibrate([150, 200, 150, 200, 300]);
          break;
      }
    } catch (e) {
      // Vibration not supported
    }
  }, []);

  return (
    <div className="w-full h-screen relative bg-black font-sans selection:bg-blue-500/30">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
          <Nebula command={currentCommand} onHaptic={triggerHaptic} />
        </Suspense>
      </Canvas>

      <Brain
        onCommand={setCurrentCommand}
        onMessage={handleNebulaMessage}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        ttsSettings={ttsSettings}
        onHaptic={triggerHaptic}
      />

      <Interface
        chatHistory={chatHistory}
        onSend={handleUserSend}
        ttsSettings={ttsSettings}
        setTtsSettings={setTtsSettings}
        onHaptic={triggerHaptic}
      />
    </div>
  );
};

export default App;
