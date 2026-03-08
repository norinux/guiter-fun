import { detectPitch, frequencyToNote } from "@/lib/pitch-detection";
import { PerformanceMetrics } from "@/types/battle";

export class PerformanceScorer {
  private notes: string[] = [];
  private noteTimestamps: number[] = [];
  private analyser: AnalyserNode | null = null;
  private rafId: number | null = null;
  private isRecording = false;

  start(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.notes = [];
    this.noteTimestamps = [];
    this.isRecording = true;
    this.tick();
  }

  stop(): PerformanceMetrics {
    this.isRecording = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    return this.calculate();
  }

  private tick = () => {
    if (!this.isRecording || !this.analyser) return;

    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);

    const frequency = detectPitch(buffer, this.analyser.context.sampleRate);
    if (frequency && frequency > 60 && frequency < 1000) {
      const result = frequencyToNote(frequency);
      // Only count if it's a new note (not the same sustained note)
      const lastNote = this.notes[this.notes.length - 1];
      if (result.noteNameWithOctave !== lastNote) {
        this.notes.push(result.noteNameWithOctave);
        this.noteTimestamps.push(performance.now());
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private calculate(): PerformanceMetrics {
    // Clean notes score (max 50): number of valid notes detected
    const cleanNotes = Math.min(this.notes.length * 2, 50);

    // Diversity score (max 30): unique note names x 3
    const uniqueNotes = new Set(this.notes.map((n) => n.replace(/\d+$/, "")));
    const diversity = Math.min(uniqueNotes.size * 3, 30);

    // Rhythm stability (max 20): based on coefficient of variation of intervals
    let rhythmStability = 0;
    if (this.noteTimestamps.length >= 3) {
      const intervals: number[] = [];
      for (let i = 1; i < this.noteTimestamps.length; i++) {
        intervals.push(this.noteTimestamps[i] - this.noteTimestamps[i - 1]);
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (mean > 0) {
        const variance =
          intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) /
          intervals.length;
        const cv = Math.sqrt(variance) / mean; // coefficient of variation
        // Lower CV = more stable rhythm. CV of 0 = perfect, CV > 1 = very unstable
        rhythmStability = Math.round(Math.max(0, 20 * (1 - cv)));
      }
    }

    const total = cleanNotes + diversity + rhythmStability;

    return { cleanNotes, diversity, rhythmStability, total };
  }
}
