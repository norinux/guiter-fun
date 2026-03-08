"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Battle, PerformanceMetrics } from "@/types/battle";
import { getBattle, submitScore, advanceRound } from "@/lib/battle-service";
import { PerformanceScorer } from "@/lib/performance-scorer";
import { getAudioContext } from "@/lib/audio";

interface BattleState {
  battle: Battle | null;
  isPlaying: boolean;
  timeLeft: number;
  metrics: PerformanceMetrics | null;
  error: string | null;
}

export function useBattle(battleId: string, userId: string | undefined) {
  const [state, setState] = useState<BattleState>({
    battle: null,
    isPlaying: false,
    timeLeft: 30,
    metrics: null,
    error: null,
  });

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scorerRef = useRef<PerformanceScorer | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Fetch battle state
  const fetchBattle = useCallback(async () => {
    const data = await getBattle(battleId);
    if (data) {
      setState((prev) => ({ ...prev, battle: data }));
    }
  }, [battleId]);

  // Start polling
  useEffect(() => {
    fetchBattle();
    pollingRef.current = setInterval(fetchBattle, 2000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchBattle]);

  // Check if it's this user's turn to play
  const isMyTurn = useCallback(() => {
    const { battle } = state;
    if (!battle || !userId) return false;
    const status = battle.status;
    if (status.endsWith("_p1") && battle.player1Id === userId) return true;
    if (status.endsWith("_p2") && battle.player2Id === userId) return true;
    return false;
  }, [state, userId]);

  // Start performance recording
  const startPlaying = useCallback(async () => {
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

      const scorer = new PerformanceScorer();
      scorerRef.current = scorer;
      scorer.start(analyser);

      setState((prev) => ({
        ...prev,
        isPlaying: true,
        timeLeft: 30,
        metrics: null,
      }));

      // 30 second countdown
      let remaining = 30;
      timerRef.current = setInterval(() => {
        remaining--;
        setState((prev) => ({ ...prev, timeLeft: remaining }));
        if (remaining <= 0) {
          stopPlaying();
        }
      }, 1000);
    } catch {
      setState((prev) => ({
        ...prev,
        error: "マイクへのアクセスが拒否されました",
      }));
    }
  }, []);

  // Stop performance and submit score
  const stopPlaying = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let metrics: PerformanceMetrics | null = null;
    if (scorerRef.current) {
      metrics = scorerRef.current.stop();
      scorerRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    analyserRef.current = null;

    setState((prev) => ({ ...prev, isPlaying: false, metrics }));

    // Submit score
    if (metrics) {
      const updated = await submitScore(battleId, metrics.total);
      if (updated) {
        setState((prev) => ({ ...prev, battle: updated }));
      }
    }
  }, [battleId]);

  // Advance to next round
  const advance = useCallback(async () => {
    const updated = await advanceRound(battleId);
    if (updated) {
      setState((prev) => ({ ...prev, battle: updated, metrics: null }));
    }
  }, [battleId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (scorerRef.current) scorerRef.current.stop();
      if (sourceRef.current) sourceRef.current.disconnect();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return {
    ...state,
    isMyTurn: isMyTurn(),
    fetchBattle,
    startPlaying,
    stopPlaying,
    advance,
  };
}
