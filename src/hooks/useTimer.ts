"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateElapsed = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = Date.now();
      const elapsed =
        accumulatedRef.current +
        Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    intervalRef.current = setInterval(updateElapsed, 1000);
  }, [isRunning, updateElapsed]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (startTimeRef.current !== null) {
      accumulatedRef.current +=
        Math.floor((Date.now() - startTimeRef.current) / 1000);
    }
    startTimeRef.current = null;
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { elapsedSeconds, isRunning, start, pause, reset };
}
