import BattleLobby from "./_components/BattleLobby";

export default function BattlesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">ギターバトル</h1>
      <p className="mb-8 text-slate-400">
        1v1のリアルタイム対戦! 3ラウンドのフリー演奏で勝負しよう
      </p>
      <BattleLobby />
    </div>
  );
}
