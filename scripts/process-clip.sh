#!/bin/bash

# Process a video clip into frames + depth maps for 3D parallax
# Usage: ./scripts/process-clip.sh <video_url_or_path> <output_name>

set -e

VIDEO_INPUT="$1"
OUTPUT_NAME="$2"

if [ -z "$VIDEO_INPUT" ] || [ -z "$OUTPUT_NAME" ]; then
  echo "Usage: ./scripts/process-clip.sh <video_url_or_path> <output_name>"
  echo "Example: ./scripts/process-clip.sh 'https://youtube.com/watch?v=xxx' smash-combo-1"
  exit 1
fi

OUTPUT_DIR="public/processed/${OUTPUT_NAME}"
mkdir -p "$OUTPUT_DIR/frames"
mkdir -p "$OUTPUT_DIR/depth"

echo "📥 Step 1: Download/copy video..."
if [[ "$VIDEO_INPUT" == http* ]]; then
  yt-dlp "$VIDEO_INPUT" -o "$OUTPUT_DIR/source.mp4" --format "best[height<=720]" --no-playlist
  VIDEO_FILE="$OUTPUT_DIR/source.mp4"
else
  VIDEO_FILE="$VIDEO_INPUT"
fi

echo "🎬 Step 2: Extract key frames (1 per second for first 10 seconds)..."
ffmpeg -i "$VIDEO_FILE" -vf "fps=1" -t 10 -q:v 2 "$OUTPUT_DIR/frames/frame_%03d.jpg" -y

echo "📊 Step 3: Generate depth maps..."

# Check if depth estimation is available
if command -v python3 &> /dev/null; then
  # Try to use MiDaS or fall back to simple edge detection
  python3 - "$OUTPUT_DIR" << 'PYTHON_SCRIPT'
import sys
import os

output_dir = sys.argv[1]
frames_dir = os.path.join(output_dir, "frames")
depth_dir = os.path.join(output_dir, "depth")

try:
    # Try importing torch and MiDaS
    import torch
    import cv2
    import numpy as np
    
    # Load MiDaS model
    model_type = "MiDaS_small"
    midas = torch.hub.load("intel-isl/MiDaS", model_type)
    midas.eval()
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    midas.to(device)
    
    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
    transform = midas_transforms.small_transform
    
    for fname in sorted(os.listdir(frames_dir)):
        if not fname.endswith('.jpg'):
            continue
        
        img_path = os.path.join(frames_dir, fname)
        img = cv2.imread(img_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        input_batch = transform(img_rgb).to(device)
        
        with torch.no_grad():
            prediction = midas(input_batch)
            prediction = torch.nn.functional.interpolate(
                prediction.unsqueeze(1),
                size=img_rgb.shape[:2],
                mode="bicubic",
                align_corners=False,
            ).squeeze()
        
        depth = prediction.cpu().numpy()
        depth = (depth - depth.min()) / (depth.max() - depth.min()) * 255
        depth = depth.astype(np.uint8)
        
        out_path = os.path.join(depth_dir, fname.replace('.jpg', '_depth.jpg'))
        cv2.imwrite(out_path, depth)
        print(f"  Processed: {fname}")
    
    print("✅ Depth maps generated with MiDaS")
    
except ImportError as e:
    print(f"⚠️  PyTorch/MiDaS not available: {e}")
    print("   Falling back to edge-based pseudo-depth...")
    
    try:
        import cv2
        import numpy as np
        
        for fname in sorted(os.listdir(frames_dir)):
            if not fname.endswith('.jpg'):
                continue
            
            img_path = os.path.join(frames_dir, fname)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            
            # Simple edge-based pseudo-depth
            blur = cv2.GaussianBlur(img, (5, 5), 0)
            edges = cv2.Canny(blur, 50, 150)
            
            # Invert and blur for depth-like effect
            depth = cv2.bitwise_not(edges)
            depth = cv2.GaussianBlur(depth, (21, 21), 0)
            
            out_path = os.path.join(depth_dir, fname.replace('.jpg', '_depth.jpg'))
            cv2.imwrite(out_path, depth)
            print(f"  Processed (edge-based): {fname}")
        
        print("✅ Pseudo-depth maps generated with edge detection")
        
    except ImportError:
        print("❌ OpenCV not available. Install with: pip3 install opencv-python")
        sys.exit(1)

PYTHON_SCRIPT
fi

echo ""
echo "✅ Processing complete!"
echo "📁 Output: $OUTPUT_DIR"
echo "   - frames/  : Extracted video frames"
echo "   - depth/   : Depth maps for parallax"
echo ""
echo "🚀 Add to your scene with the DepthParallax component"
