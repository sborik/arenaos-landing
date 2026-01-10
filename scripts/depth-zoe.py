"""
High-quality depth generation using ZoeDepth (Hugging Face) for processed clips.

Prereqs (once):
  pip install torch torchvision timm transformers pillow opencv-python

Usage examples (run from repo root):
  # Single frame
  python3 scripts/depth-zoe.py --base public/processed/smash-bros-ultimate-gzl1kcle7ai --frame frame_001

  # All frames in the clip
  python3 scripts/depth-zoe.py --base public/processed/smash-bros-ultimate-gzl1kcle7ai --all
"""

import argparse
import os
import sys
from pathlib import Path
from typing import List, Optional

import numpy as np
from PIL import Image


def parse_args():
  parser = argparse.ArgumentParser(description="Generate depth maps with ZoeDepth")
  parser.add_argument(
    "--base",
    required=True,
    help="Base directory containing frames/ and depth/ (e.g., public/processed/<clip>)",
  )
  parser.add_argument(
    "--frame",
    default=None,
    help="Specific frame stem (e.g., frame_001). If omitted and --all not set, defaults to frame_001.",
  )
  parser.add_argument(
    "--all",
    action="store_true",
    help="Process all .jpg frames in frames/ directory",
  )
  parser.add_argument(
    "--model",
    default="Intel/zoedepth-nyu",
    help="Hugging Face model id (e.g., Intel/zoedepth-nyu or Intel/zoedepth-kitti)",
  )
  parser.add_argument(
    "--max-size",
    type=int,
    default=1024,
    help="Resize larger edge to this before inference to control memory/time (default: 1024)",
  )
  return parser.parse_args()


def pick_device():
  import torch

  if torch.cuda.is_available():
    return "cuda"
  if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    return "mps"
  return "cpu"


def load_model(model_id: str, device: str):
  from transformers import AutoImageProcessor, AutoModelForDepthEstimation
  import torch

  processor = AutoImageProcessor.from_pretrained(model_id)
  model = AutoModelForDepthEstimation.from_pretrained(model_id)
  model.to(device)
  model.eval()
  return processor, model


def normalize_depth(depth: np.ndarray) -> np.ndarray:
  depth = depth.astype(np.float32)
  d_min, d_max = depth.min(), depth.max()
  if d_max - d_min < 1e-6:
    return np.zeros_like(depth, dtype=np.uint8)
  norm = (depth - d_min) / (d_max - d_min)
  return (norm * 255.0).clip(0, 255).astype(np.uint8)


def process_frame(frame_path: Path, out_path: Path, processor, model, device: str, max_size: int):
  import torch

  image = Image.open(frame_path).convert("RGB")
  # Optional resize to keep memory/time manageable
  if max(image.size) > max_size:
    image.thumbnail((max_size, max_size), Image.LANCZOS)

  inputs = processor(images=image, return_tensors="pt")
  inputs = {k: v.to(device) for k, v in inputs.items()}

  with torch.no_grad():
    outputs = model(**inputs)
    predicted_depth = outputs.predicted_depth

  # Upsample back to image size
  depth = torch.nn.functional.interpolate(
    predicted_depth.unsqueeze(1),
    size=image.size[::-1],
    mode="bicubic",
    align_corners=False,
  ).squeeze()

  depth_np = depth.cpu().numpy()
  depth_img = normalize_depth(depth_np)

  out_path.parent.mkdir(parents=True, exist_ok=True)
  Image.fromarray(depth_img).save(out_path)
  return True


def collect_frames(base: Path, frame_stem: Optional[str], process_all: bool) -> List[Path]:
  frames_dir = base / "frames"
  if not frames_dir.exists():
    raise FileNotFoundError(f"Missing frames directory: {frames_dir}")

  if process_all:
    return sorted(frames_dir.glob("*.jpg"))

  stem = frame_stem or "frame_001"
  path = frames_dir / f"{stem}.jpg"
  if not path.exists():
    raise FileNotFoundError(f"Frame not found: {path}")
  return [path]


def main():
  args = parse_args()
  base = Path(args.base)

  frames = collect_frames(base, args.frame, args.all)
  device = pick_device()
  print(f"Using device: {device}")
  processor, model = load_model(args.model, device)

  depth_dir = base / "depth"
  processed = 0

  for frame_path in frames:
    out_path = depth_dir / f"{frame_path.stem}_depth.jpg"
    print(f"Processing {frame_path.name} -> {out_path.name}")
    ok = process_frame(frame_path, out_path, processor, model, device, args.max_size)
    if ok:
      processed += 1

  print(f"Done. Wrote {processed} depth maps to {depth_dir}")


if __name__ == "__main__":
  try:
    main()
  except Exception as exc:
    print(f"Error: {exc}", file=sys.stderr)
    sys.exit(1)
