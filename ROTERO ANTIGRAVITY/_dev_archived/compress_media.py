import os
from pathlib import Path
from PIL import Image
from moviepy import VideoFileClip

def print_size_diff(orig_size, new_size, orig_path, new_path):
    orig_mb = orig_size / (1024 * 1024)
    new_mb = new_size / (1024 * 1024)
    savings = (1 - (new_size / orig_size)) * 100 if orig_size > 0 else 0
    print(f"[{savings:.1f}% saved] {orig_path.name} ({orig_mb:.2f} MB) -> {new_path.name} ({new_mb:.2f} MB)")

def compress_image(file_path):
    output_path = file_path.with_suffix('.webp')
    if file_path.suffix.lower() == '.webp':
        return # already webp
    
    try:
        orig_size = file_path.stat().st_size
        with Image.open(file_path) as img:
            # Convert RGBA to RGB if saving as webp without transparency
            # But webp supports transparency, so we can keep RGBA
            # Resize if very large, but let's keep it under 1920px width/height safely
            max_size = (1920, 1920)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            img.save(output_path, 'WEBP', quality=80)
            
        new_size = output_path.stat().st_size
        print_size_diff(orig_size, new_size, file_path, output_path)
        
        # Optionally remove original to save space
        # file_path.unlink()
    except Exception as e:
        print(f"Error compressing {file_path.name}: {e}")

def compress_video(file_path):
    output_path = file_path.with_suffix('.webm')
    if file_path.suffix.lower() == '.webm':
        return
        
    try:
        orig_size = file_path.stat().st_size
        # Use moviepy to read the video and write it as webm
        with VideoFileClip(str(file_path)) as clip:
            # Resize video if too large, e.g., max 1080p width
            if clip.w > 1920:
                clip = clip.resized(width=1920)
            clip.write_videofile(
                str(output_path),
                codec='libvpx-vp9',
                audio_codec='libvorbis',
                threads=4,
                preset='medium',
                bitrate='1000k'
            )
            
        new_size = output_path.stat().st_size
        print_size_diff(orig_size, new_size, file_path, output_path)
        
        # file_path.unlink()
    except Exception as e:
        print(f"Error compressing video {file_path.name}: {e}")

def main():
    root_dir = Path.cwd()
    image_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
    video_exts = {'.mp4', '.mov', '.avi', '.mkv'}
    
    # We will search specifically in the assets/tienda folder and others
    for root, _, files in os.walk(root_dir):
        # Exclude node_modules or .git if they exist
        if '.git' in root or '.netlify' in root:
            continue
            
        for file in files:
            file_path = Path(root) / file
            ext = file_path.suffix.lower()
            
            if ext in image_exts:
                compress_image(file_path)
            elif ext in video_exts:
                compress_video(file_path)

if __name__ == "__main__":
    main()
