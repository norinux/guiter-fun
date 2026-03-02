"use client";

import { ChordDefinition } from "@/types/chord";

interface ChordDiagramProps {
  chord: ChordDefinition;
  size?: number;
}

export default function ChordDiagram({ chord, size = 1 }: ChordDiagramProps) {
  const stringCount = 6;
  const fretCount = 5;
  const stringSpacing = 24 * size;
  const fretSpacing = 28 * size;
  const paddingTop = 36 * size;
  const paddingLeft = 30 * size;
  const paddingRight = 10 * size;
  const paddingBottom = 16 * size;
  const dotRadius = 8 * size;
  const fontSize = 11 * size;

  const width = paddingLeft + (stringCount - 1) * stringSpacing + paddingRight;
  const height = paddingTop + fretCount * fretSpacing + paddingBottom;

  const stringX = (s: number) => paddingLeft + (s - 1) * stringSpacing;
  const fretY = (f: number) => paddingTop + f * fretSpacing;

  const showNut = chord.startFret === 1;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-lg font-bold">{chord.nameShort}</span>
      <svg width={width} height={height} className="select-none">
        {/* フレット番号（ナットでない場合） */}
        {!showNut && (
          <text
            x={paddingLeft - 16 * size}
            y={fretY(0) + fretSpacing / 2 + 4 * size}
            textAnchor="middle"
            fontSize={fontSize}
            fill="currentColor"
          >
            {chord.startFret}
          </text>
        )}

        {/* ナットまたは通常の線 */}
        <line
          x1={stringX(1)}
          y1={fretY(0)}
          x2={stringX(stringCount)}
          y2={fretY(0)}
          stroke="currentColor"
          strokeWidth={showNut ? 4 * size : 1.5 * size}
        />

        {/* フレット線 */}
        {Array.from({ length: fretCount }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={stringX(1)}
            y1={fretY(i + 1)}
            x2={stringX(stringCount)}
            y2={fretY(i + 1)}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1 * size}
          />
        ))}

        {/* 弦 */}
        {Array.from({ length: stringCount }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={stringX(i + 1)}
            y1={fretY(0)}
            x2={stringX(i + 1)}
            y2={fretY(fretCount)}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1 * size}
          />
        ))}

        {/* バレー */}
        {chord.barreeFret !== undefined && (
          <rect
            x={stringX(1) - dotRadius}
            y={
              fretY(chord.barreeFret - chord.startFret) +
              fretSpacing / 2 -
              dotRadius
            }
            width={(stringCount - 1) * stringSpacing + dotRadius * 2}
            height={dotRadius * 2}
            rx={dotRadius}
            fill="currentColor"
            fillOpacity={0.8}
          />
        )}

        {/* 指の位置 */}
        {chord.fingers.map((fp, idx) => {
          // string: 1=highE(右), 6=lowE(左)
          const x = stringX(stringCount - fp.string + 1);
          const relativeFret = fp.fret - chord.startFret + 1;
          const y = fretY(relativeFret - 1) + fretSpacing / 2;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r={dotRadius} fill="currentColor" />
              <text
                x={x}
                y={y + 4 * size}
                textAnchor="middle"
                fontSize={fontSize * 0.9}
                fill="var(--background)"
                fontWeight="bold"
              >
                {fp.finger}
              </text>
            </g>
          );
        })}

        {/* オープン / ミュート表示 */}
        {chord.strings.map((fret, i) => {
          // i: 0=lowE, 5=highE
          const stringNum = i + 1; // 1=lowE ~ 6=highE
          const x = stringX(stringCount - stringNum + 1);
          const y = fretY(0) - 12 * size;

          if (fret === 0) {
            return (
              <circle
                key={`open-${i}`}
                cx={x}
                cy={y}
                r={5 * size}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5 * size}
              />
            );
          }
          if (fret === -1) {
            return (
              <text
                key={`mute-${i}`}
                x={x}
                y={y + 4 * size}
                textAnchor="middle"
                fontSize={fontSize}
                fill="currentColor"
                fontWeight="bold"
              >
                ×
              </text>
            );
          }
          return null;
        })}
      </svg>
      <span className="mt-1 text-xs text-foreground/50">{chord.name}</span>
    </div>
  );
}
