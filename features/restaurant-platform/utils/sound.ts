let audioContext: AudioContext | null = null;

// Two quick ascending tones synthesized via Web Audio — no audio asset to
// host, and short/controlled enough to match "tydlig men kontrollerad",
// not a jingle. Fails silently: autoplay policies or a headless test
// runner blocking audio shouldn't break the actual order flow, and the
// card highlight + toast already carry the same signal visually.
export function playNewOrderChime(): void {
  try {
    if (!audioContext) {
      const AudioContextClass =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    const now = audioContext.currentTime;
    playTone(audioContext, 780, now, 0.12);
    playTone(audioContext, 1040, now + 0.11, 0.16);
  } catch {
    // Ignore — see comment above.
  }
}

function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}
