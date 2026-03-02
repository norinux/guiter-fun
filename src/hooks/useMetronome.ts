"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getAudioContext, playClick } from "@/lib/audio";

export function useMetronome(initialBpm: number = 120) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerMeasure);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    beatsRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    const scheduleAheadTime = 0.1;

    while (
      nextNoteTimeRef.current <
      ctx.currentTime + scheduleAheadTime
    ) {
      const freq = currentBeatRef.current === 0 ? 880 : 440;
      playClick(nextNoteTimeRef.current, freq);

      const beatAtSchedule = currentBeatRef.current;
      const scheduledTime = nextNoteTimeRef.current;

      // ビジュアル更新用のタイムアウト
      const delay = (scheduledTime - ctx.currentTime) * 1000;
      setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentBeat(beatAtSchedule);
        }
      }, Math.max(0, delay));

      currentBeatRef.current =
        (currentBeatRef.current + 1) % beatsRef.current;
      nextNoteTimeRef.current += 60.0 / bpmRef.current;
    }
  }, []);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentBeat(0);
    timerIdRef.current = setInterval(scheduler, 25);
  }, [scheduler]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentBeat(0);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  return {
    bpm,
    setBpm,
    isPlaying,
    start,
    stop,
    currentBeat,
    beatsPerMeasure,
    setBeatsPerMeasure,
  };
}
