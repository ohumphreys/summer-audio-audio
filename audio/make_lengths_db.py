#!/usr/bin/env python3
"""Write a CSV of the duration of every .wav file in audio/GA and audio/Southern.

Columns: accent (GA or Southern), file (file name), length_s (seconds).
"""

import wave
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

FOLDERS = ("GA", "Southern")

OUTPUT = BASE_DIR / "audio_lengths.csv"


def duration(path):
    """Length of a .wav file in seconds."""
    with wave.open(str(path)) as w:
        return w.getnframes() / w.getframerate()


def main():
    rows = []
    for folder in FOLDERS:
        directory = BASE_DIR / folder
        if not directory.is_dir():
            raise SystemExit(f"Directory not found: {directory}")
        for path in sorted(directory.glob("*.wav")):
            rows.append({"accent": folder, "file": path.name, "length_s": duration(path)})

    df = pd.DataFrame(rows, columns=["accent", "file", "length_s"])
    df.to_csv(OUTPUT, index=False)
    print(f"Wrote {len(df)} rows to {OUTPUT}")


if __name__ == "__main__":
    main()
