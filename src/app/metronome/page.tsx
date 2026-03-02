"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PracticeSession } from "@/types/practice";
import Metronome from "./_components/Metronome";
import PracticeTimer from "./_components/PracticeTimer";
import PracticeLogger from "./_components/PracticeLogger";
import PracticeHistory from "./_components/PracticeHistory";

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [pendingDuration, setPendingDuration] = useState<number | null>(null);
  const [sessions, setSessions] = useLocalStorage<PracticeSession[]>(
    "guitar-fun-sessions",
    []
  );

  const handleSessionEnd = (durationSeconds: number) => {
    setPendingDuration(durationSeconds);
  };

  const handleSave = (session: PracticeSession) => {
    setSessions((prev) => [...prev, session]);
    setPendingDuration(null);
  };

  const handleCancel = () => {
    setPendingDuration(null);
  };

  const handleClear = () => {
    setSessions([]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">メトロノーム</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Metronome bpm={bpm} onBpmChange={setBpm} />
          <PracticeTimer onSessionEnd={handleSessionEnd} />
        </div>

        <div>
          {pendingDuration !== null ? (
            <PracticeLogger
              durationSeconds={pendingDuration}
              bpm={bpm}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <PracticeHistory sessions={sessions} onClear={handleClear} />
          )}
        </div>
      </div>
    </div>
  );
}
