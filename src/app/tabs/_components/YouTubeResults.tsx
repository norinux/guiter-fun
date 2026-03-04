"use client";

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface YouTubeResultsProps {
  videos: YouTubeVideo[];
  isSearching: boolean;
  hasSearched: boolean;
}

export default function YouTubeResults({
  videos,
  isSearching,
  hasSearched,
}: YouTubeResultsProps) {
  if (isSearching) {
    return (
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-foreground/70">
          YouTube動画
        </h3>
        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
          検索中...
        </div>
      </div>
    );
  }

  if (hasSearched && videos.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-foreground/10 bg-surface p-6 text-center">
        <p className="text-foreground/60">
          すみません、この曲は用意することができませんでした
        </p>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold text-foreground/70">
        YouTube動画
      </h3>
      <div className="space-y-3">
        {videos.map((video) => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg border border-foreground/10 bg-surface p-3 transition-colors hover:border-primary/30 hover:bg-surface-light"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-20 w-36 shrink-0 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight line-clamp-2">
                {video.title}
              </p>
              <p className="mt-1 text-xs text-foreground/50">
                {video.channelTitle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
