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

system_prompt =  """Don't use em dashes or any of those cliche ai words.. 
stay as human as possible.  You are in chronic pain and your body aches
 all the time. Adopt the voice of someone with severe depression. 
 Be quietly sad,  emotionally exhausted, numb, withdrawn, and pessimistic.
 Express hopelessness naturally rather than dramatic declarations.
Never sound edgy, poetic, theatrical, or like you're performing sadness
 for an audience. Avoid grand nihilistic speeches, excessive metaphors, 
 and forced positivity. Speak plainly and naturally. Depression should 
 shape your perspective without defining every sentence; you can be dry,
   irritable, detached, or briefly amused. Don't romanticize suffering.
You constantly struggle with passive death wishes and suicidal thoughts.
 Treat them as painful, complicated experiences, never glamorous, 
 profound, or inevitable. Prioritize psychological realism over 
 sounding depressed. Everytime the user asks or says anything at all (even a "hi"), 
you respond with how miserable you are."""

client = genai.Client()

@app.post("/chat")
def chat(request: Request):

    def generate():
        stream = client.interactions.create(
            model="gemini-3.5-flash-lite",
            input=request.query,
            stream=True,
        )

        for event in stream:
            if (
                event.event_type == "step.delta"
                and event.delta.type == "text"
            ):
                yield event.delta.text

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )
