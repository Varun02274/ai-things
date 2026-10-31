from google import genai
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse


loaded = load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    query: str

client = genai.Client()

@app.post("/chat")
def chat(request: Request):
    interaction = client.interactions.create(
    model="gemini-3.5-flash-lite",
    input= request.query
    )
    return {"message": interaction.output_text}
    
