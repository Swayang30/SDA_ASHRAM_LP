"use client";

import { useEffect, useRef, useState } from "react";
import { introConfig } from "@/data/site";

/** Phase 2 of the intro — muted autoplay ashram reel (20–30s) with progress. */
export default function IntroVideo({ onEnded }: { onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Safety auto-advance in case the reel is missing or longer than expected.
    const safety = window.setTimeout(onEnded, introConfig.VIDEO_MAX_MS);

    const onTime = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };
    const onErr = () => setHasVideo(false);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr);
    v.play().catch(() => {
      /* autoplay may be blocked; safety timer still advances */
    });

    return () => {
      window.clearTimeout(safety);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr);
    };
  }, [onEnded]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        poster={introConfig.poster}
        preload="auto"
      >
        {/* TODO: drop the real 20–30s ashram reel at public/video/intro-reel.mp4 */}
        <source src={introConfig.video} type="video/mp4" />
      </video>

      {/* cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.7))]" />

      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a0700]">
          <p className="font-script text-3xl text-orange">
            Glimpses of the Ashram
          </p>
        </div>
      )}

      {/* thin progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
        <div
          className="h-full bg-orange transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
