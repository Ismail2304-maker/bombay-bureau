"use client";

import { useRef, useState } from "react";

type VideoItem = {
  title: string;
  slug?: {
    current?: string;
  };
  mainImage?: any;
  videoUrl?: string;
  videoMimeType?: string;
  posterUrl?: string | null;
  duration?: string;
  publishedAt?: string;
};

type Props = {
  videos: VideoItem[];
};

export default function VideoSection({ videos }: Props) {
  const [playing, setPlaying] = useState<string | null>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

 
  const playVideo = async (key: string) => {
    const video = videoRefs.current[key];

    if (!video) return;

    try {
      await video.play();
      setPlaying(key);
    } catch (error) {
      console.error("Video playback failed:", error);
    }
  };

  return (
    <section
      id="video"
      className="border-t border-gray-800 mt-20 md:mt-24 pt-10 pb-10 scroll-mt-32 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* WATCH HEADER */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
              WATCH
            </h2>

            <p className="mt-1 text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Visual stories from India and around the world.
            </p>
          </div>

          <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
            Latest visual stories
          </span>
        </div>

        {/* VIDEO ROW */}
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-5 snap-x snap-mandatory scrollbar-hide">

          {videos.slice(0, 10).map((video, index) => {
            const key =
              video.slug?.current ||
              `${video.title}-${index}`;

            return (
              <article
                key={key}
                className="group shrink-0 w-[165px] sm:w-[180px] md:w-[195px] lg:w-[210px] snap-start"
              >

                {/* PORTRAIT VIDEO */}
                <div className="relative overflow-hidden rounded-lg aspect-[9/14] bg-gray-900">

                  {video.videoUrl ? (
                    <>
                      <video
                        ref={(element) => {
                          videoRefs.current[key] = element;
                        }}
                        src={video.videoUrl}
                        playsInline
                        preload="none"
                        poster={video.posterUrl || undefined}
                        controls={playing === key}
                        className="absolute inset-0 w-full h-full object-cover"
                        onPause={() => {
                          if (playing === key) {
                            setPlaying(null);
                          }
                        }}
                        onEnded={() => {
                          if (playing === key) {
                            setPlaying(null);
                          }
                        }}
                      />

                      {/* DARK GRADIENT */}
                      {playing !== key && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                      )}

                      {/* CATEGORY */}
                      {playing !== key && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">
                            Video
                          </span>
                        </div>
                      )}

                      {/* PLAY BUTTON */}
                      {playing !== key && (
                        <button
                          type="button"
                          onClick={() => playVideo(key)}
                          aria-label={`Play ${video.title}`}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 border-white bg-black/20 backdrop-blur-sm flex items-center justify-center text-white transition-transform duration-200 hover:scale-110"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-white ml-0.5"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}

                      {/* DURATION */}
                      {video.duration && playing !== key && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-black/75 px-1.5 py-1 rounded text-[10px] font-medium text-white">
                            {video.duration}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                      Video unavailable
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-sm md:text-[15px] font-serif font-medium leading-snug text-white line-clamp-3">
                  {video.title}
                </h3>

                {/* DATE */}
                {video.publishedAt && (
                  <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-gray-600">
                    {new Date(video.publishedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </p>
                )}

              </article>
            );
          })}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-gray-700" />
        </div>

      </div>
    </section>
  );
}