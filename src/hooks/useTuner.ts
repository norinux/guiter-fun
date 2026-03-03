"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  detectPitch,
  frequencyToNote,
  PitchResult,
  GuitarString,
} from "@/lib/pitch-detection";
import { getAudioContext } from "@/lib/audio";

interface TunerState {
  isListening: boolean;
  pitchResult: PitchResult | null;
  error: string | null;
}

export function useTuner() {
  const [state, setState] = useState<TunerState>({
    isListening: false,
    pitchResult: null,
    error: null,
  });

  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const analyze = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    const frequency = detectPitch(buffer, analyser.context.sampleRate);

    if (frequency && frequency > 60 && frequency < 1000) {
      const result = frequencyToNote(frequency);
      setState((prev) => ({
        ...prev,
        pitchResult: result,
      }));
    }

    rafRef.current = requestAnimationFrame(analyze);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      mediaStreamRef.current = stream;

      const audioContext = getAudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;

      setState({
        isListening: true,
        pitchResult: null,
        error: null,
      });

      rafRef.current = requestAnimationFrame(analyze);
    } catch {
      setState({
        isListening: false,
        pitchResult: null,
        error: "マイクへのアクセスが拒否されました。設定を確認してください。",
      });
    }
  }, [analyze]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    analyserRef.current = null;

    setState({
      isListening: false,
      pitchResult: null,
      error: null,
    });
  }, []);

  const playReferenceNote = useCallback((guitarString: GuitarString) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = guitarString.frequency;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 2
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    ...state,
    start,
    stop,
    playReferenceNote,
  };
}
