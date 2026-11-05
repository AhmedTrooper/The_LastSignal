"""Extract lightweight poster images from local reels; never copy the videos into git."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "apps/web/public/reels"
REELS = {
    "oppy-tour": "Oppy's tour of Rovervilla.mp4",
    "why-mars": "Why did you go to Mars_.mp4",
    "spirit-wheel": "Spirit's lucky broken wheel.mp4",
    "oppy-signal": "Oppy's last signal.mp4",
    "seven-minutes": "Seven minutes of terror.mp4",
    "buggy": "Never tell Buggy it was staged.mp4",
    "the-leak": "The leak.mp4",
    "night-call": "The night call.mp4",
}

if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, filename in REELS.items():
        source = ROOT / "videos" / filename
        if not source.is_file():
            raise FileNotFoundError(source)
        subprocess.run([
            "ffmpeg", "-v", "error", "-ss", "3", "-i", str(source),
            "-frames:v", "1", "-vf", "scale=360:-1", "-quality", "80",
            "-y", str(OUTPUT / f"{name}.webp"),
        ], check=True)
        print(f"Created {name}.webp")
