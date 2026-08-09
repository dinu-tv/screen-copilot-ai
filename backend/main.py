from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from screen_capture import capture_screen_bytes
from vision_agent import analyze_screen

app = FastAPI(title="Screen Copilot API")

# Allow Frontend (React at port 5173) to communicate with Backend (FastAPI at port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    prompt: str

@app.get("/")
def health_check():
    return {"status": "Screen Copilot Backend Running!"}

@app.post("/api/analyze")
async def analyze_screen_endpoint(request: AnalyzeRequest):
    try:
        # 1. Capture screen pixels
        image_bytes = capture_screen_bytes()
        
        # 2. Process with Gemini AI Vision
        result = analyze_screen(image_bytes, request.prompt)
        
        return {"status": "success", "analysis": result}
    except Exception as e:
        print(f"\n❌ BACKEND ERROR DETECTED:\n{e}\n")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)