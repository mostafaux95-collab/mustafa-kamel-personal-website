import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  playClick: () => void;
  playSuccess: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "mk-portfolio-sound-enabled";

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true",
  );
  const ctxRef = useRef<AudioContext | null>(null);

  function getCtx() {
    if (!ctxRef.current) {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtor();
    }
    return ctxRef.current;
  }

  function tone(freq: number, duration: number, delay = 0, gain = 0.05) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(ctx.destination);
    const start = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  const playClick = useCallback(() => {
    if (!enabled) return;
    tone(720, 0.06);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const playSuccess = useCallback(() => {
    if (!enabled) return;
    tone(523.25, 0.12, 0);
    tone(659.25, 0.12, 0.08);
    tone(783.99, 0.18, 0.16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ enabled, toggle, playClick, playSuccess }),
    [enabled, toggle, playClick, playSuccess],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
