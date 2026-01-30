export type HueShift = 'dawn_rose' | 'day_crisp' | 'dusk_amber' | 'night_indigo' | 'joy_gold' | 'sorrow_violet' | 'anger_red' | 'calm_cyan' | 'none';
export type MotionType = 'breathe_slow' | 'breathe_fast' | 'vortex_inward' | 'vortex_outward' | 'scatter_burst' | 'fall_like_rain' | 'rise_like_smoke' | 'pulse_heart' | 'spiral_dance' | 'rage_tremor' | 'freeze_still';
export type DesignType = 'text' | 'symbol' | 'face' | 'formation' | 'picture' | 'none';
export type HapticType = 'heartbeat' | 'spontaneous' | 'intake' | 'speech' | 'joy' | 'sorrow' | 'anger' | 'wonder' | 'touch' | 'deep_resonance';

export interface NebulaCommand {
  primary_motion: MotionType;
  hue_shift?: HueShift;
  design?: {
    type: DesignType;
    content: string;
    duration: number;
    intensity?: number;
    color?: HueShift;
  } | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TTSSettings {
  enabled: boolean;
  apiKey?: string;
  voiceId?: string;
}
