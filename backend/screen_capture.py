import io
import mss
from PIL import Image

def capture_screen_bytes() -> bytes:
    """Captures the primary display and converts it into raw PNG bytes."""
    with mss.mss() as sct:
        monitor = sct.monitors[1]  # Primary monitor
        sct_img = sct.grab(monitor)
        
        # Convert raw BGRA bytes to a PIL Image
        img = Image.frombytes("RGB", sct_img.size, sct_img.bgra, "raw", "BGRX")
        
        # Save image to bytes buffer in PNG format
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return buffer.getvalue()