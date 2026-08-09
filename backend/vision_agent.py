import os
import io
from google import genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

def analyze_screen(image_bytes: bytes, user_prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in backend/.env file!")

    client = genai.Client(api_key=api_key)
    image = Image.open(io.BytesIO(image_bytes))

    system_instruction = (
        "You are an expert Vision-Agentic AI Copilot. Analyze the user's computer screen screenshot "
        "and respond accurately to their request. If they ask to extract code, provide clean, copyable code. "
        "If they ask to extract data, format it into clean Markdown tables."
    )

    # Use gemini-3.5-flash
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=[system_instruction, image, user_prompt]
    )
    return response.text