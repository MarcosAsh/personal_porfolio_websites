#!/usr/bin/env python3
"""Synthesises the startup chime played when you click Enter on the login
screen: a rising arpeggio of glassy bells over a soft pad, with a short reverb.
Writes static/sound/startup.mp3 (needs ffmpeg). Run from the repo root."""
import os
import subprocess
import wave

import numpy as np

RATE = 44100
LENGTH = 2.6


def bell(freq, start, dur, amp, t):
    """A struck glass tone: a few inharmonic partials with their own decays."""
    x = np.zeros_like(t)
    on = t >= start
    tt = t[on] - start
    for ratio, gain, decay in ((1.0, 1.0, 2.2), (2.0, 0.35, 3.5), (2.76, 0.18, 5.0), (5.4, 0.06, 9.0)):
        x[on] += gain * np.sin(2 * np.pi * freq * ratio * tt) * np.exp(-decay * tt / dur)
    attack = np.clip(tt / 0.006, 0, 1)
    x[on] *= attack * amp
    return x


def pad(freqs, t):
    """Slow detuned sines, swelling in and out."""
    env = np.sin(np.pi * np.clip(t / LENGTH, 0, 1)) ** 1.5
    x = sum(np.sin(2 * np.pi * f * t) + np.sin(2 * np.pi * f * 1.003 * t + 1.0) for f in freqs)
    return x * env * 0.05


def reverb(x):
    """A handful of feedback comb filters, the classic cheap room."""
    out = np.copy(x)
    for delay_ms, gain in ((29.7, 0.78), (37.1, 0.75), (41.1, 0.73), (43.7, 0.7)):
        d = int(RATE * delay_ms / 1000)
        y = np.copy(x)
        for i in range(d, len(y)):
            y[i] += gain * y[i - d]
        out += 0.22 * y
    return out


def main():
    t = np.arange(int(RATE * LENGTH)) / RATE
    # E major add9, rising: E5 G#5 B5 F#6 B6
    notes = [(659.26, 0.00), (830.61, 0.12), (987.77, 0.24), (1479.98, 0.40), (1975.53, 0.58)]
    x = sum(bell(f, s, 1.6, 0.55 if i < 4 else 0.4, t) for i, (f, s) in enumerate(notes))
    x += pad([164.81, 246.94, 329.63, 415.30], t)
    x = reverb(x)
    fade = np.clip((LENGTH - t) / 0.5, 0, 1)
    x *= fade
    x /= np.max(np.abs(x)) * 1.12

    os.makedirs("static/sound", exist_ok=True)
    wav = "tools/startup.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "96k",
                    "static/sound/startup.mp3"], check=True)
    os.remove(wav)
    print("wrote static/sound/startup.mp3")


if __name__ == "__main__":
    main()
