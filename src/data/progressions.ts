import { ChordProgression } from "@/types/chord";

export const progressions: ChordProgression[] = [
  {
    id: "pop-1",
    name: "定番ポップス進行",
    description: "J-POPや洋楽で最もよく使われるコード進行",
    chordIds: ["C", "G", "Am", "F"],
    beatsPerChord: 4,
  },
  {
    id: "pop-2",
    name: "4コード進行 (G始まり)",
    description: "明るく開放的なサウンドのコード進行",
    chordIds: ["G", "D", "Em", "C"],
    beatsPerChord: 4,
  },
  {
    id: "minor-1",
    name: "マイナー進行",
    description: "切ない雰囲気のマイナーキー進行",
    chordIds: ["Am", "Dm", "G", "C"],
    beatsPerChord: 4,
  },
  {
    id: "blues-1",
    name: "ブルース / ロック進行",
    description: "ロックやブルースの基本パターン",
    chordIds: ["E", "A", "B7", "E"],
    beatsPerChord: 4,
  },
  {
    id: "jpop-1",
    name: "J-POP王道進行",
    description: "日本のポップスで定番の「4536進行」",
    chordIds: ["F", "G", "Em", "Am"],
    beatsPerChord: 4,
  },
];
