from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
from typing import Dict, Optional
from datetime import datetime

from emotion_detector import EmotionDetector
from light_controller import LightController
from models import EmotionMapping, LightState, SystemStatus

# Global variables
emotion_detector: Optional[EmotionDetector] = None
light_controller: Optional[LightController] = None
detection_task: Optional[asyncio.Task] = None
current_emotion: Dict = {"emotion": "neutral", "confidence": 0.0, "timestamp": None}
emotion_mappings: Dict[str, LightState] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global emotion_detector, light_controller
    emotion_detector = EmotionDetector()
    light_controller = LightController()
    
    # Load default mappings
    load_default_mappings()
    
    yield
    
    # Shutdown
    if detection_task and not detection_task.done():
        detection_task.cancel()
    if emotion_detector:
        emotion_detector.stop()

app = FastAPI(title="Mood Lighting API", version="1.0.0", lifespan=lifespan)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_default_mappings():
    """Load default emotion to light mappings"""
    global emotion_mappings
    emotion_mappings = {
        "happy": LightState(color="#FFD700", brightness=100, transition_speed=1.0),
        "sad": LightState(color="#4169E1", brightness=50, transition_speed=2.0),
        "angry": LightState(color="#FF0000", brightness=80, transition_speed=0.5),
        "neutral": LightState(color="#FFFFFF", brightness=50, transition_speed=1.5),
        "surprise": LightState(color="#FF69B4", brightness=90, transition_speed=0.3),
        "fear": LightState(color="#800080", brightness=70, transition_speed=0.8),
    }

# REST Endpoints
@app.get("/")
async def root():
    return {"message": "Mood Lighting API is running", "status": "ok"}

@app.get("/api/status", response_model=SystemStatus)
async def get_status():
    """Get system status"""
    is_running = detection_task is not None and not detection_task.done()
    return SystemStatus(
        is_running=is_running,
        current_emotion=current_emotion.get("emotion", "none"),
        confidence=current_emotion.get("confidence", 0.0),
        timestamp=current_emotion.get("timestamp")
    )

@app.post("/api/start-detection")
async def start_detection():
    """Start emotion detection"""
    global detection_task
    
    if detection_task and not detection_task.done():
        raise HTTPException(status_code=400, detail="Detection already running")
    
    if not emotion_detector:
        raise HTTPException(status_code=500, detail="Emotion detector not initialized")
    
    emotion_detector.start()
    detection_task = asyncio.create_task(detection_loop())
    
    return {"status": "started", "message": "Emotion detection started"}

@app.post("/api/stop-detection")
async def stop_detection():
    """Stop emotion detection"""
    global detection_task
    
    if not detection_task or detection_task.done():
        raise HTTPException(status_code=400, detail="Detection not running")
    
    emotion_detector.stop()
    detection_task.cancel()
    detection_task = None
    
    return {"status": "stopped", "message": "Emotion detection stopped"}

@app.get("/api/current-emotion")
async def get_current_emotion():
    """Get the currently detected emotion"""
    return current_emotion

@app.get("/api/mappings")
async def get_mappings():
    """Get all emotion-to-light mappings"""
    return emotion_mappings

@app.post("/api/mappings")
async def update_mappings(mappings: Dict[str, EmotionMapping]):
    """Update emotion-to-light mappings"""
    global emotion_mappings
    
    for emotion, mapping in mappings.items():
        emotion_mappings[emotion] = LightState(
            color=mapping.color,
            brightness=mapping.brightness,
            transition_speed=mapping.transition_speed
        )
    
    return {"status": "updated", "mappings": emotion_mappings}

@app.post("/api/mappings/{emotion}")
async def update_single_mapping(emotion: str, mapping: EmotionMapping):
    """Update a single emotion-to-light mapping"""
    global emotion_mappings
    
    emotion_mappings[emotion] = LightState(
        color=mapping.color,
        brightness=mapping.brightness,
        transition_speed=mapping.transition_speed
    )
    
    return {"status": "updated", "emotion": emotion, "mapping": mapping}

@app.post("/api/control-light")
async def control_light(light_state: LightState):
    """Manually control the light (for testing)"""
    try:
        light_controller.set_light(light_state)
        return {"status": "success", "light_state": light_state}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint for real-time updates
@app.websocket("/ws/emotions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send current emotion every 500ms
            await websocket.send_json(current_emotion)
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

# Background detection loop
async def detection_loop():
    """Background task that continuously detects emotions and updates lights"""
    global current_emotion
    
    emotion_history = []
    history_size = 6  # ~3 seconds at 2 FPS
    
    while True:
        try:
            # Get emotion from detector
            result = emotion_detector.detect_emotion()
            
            if result:
                emotion_history.append(result)
                if len(emotion_history) > history_size:
                    emotion_history.pop(0)
                
                # Get most common emotion from history (smoothing)
                if len(emotion_history) >= 3:
                    emotions = [e["emotion"] for e in emotion_history]
                    most_common = max(set(emotions), key=emotions.count)
                    avg_confidence = sum(e["confidence"] for e in emotion_history if e["emotion"] == most_common) / emotions.count(most_common)
                    
                    # Update current emotion
                    current_emotion = {
                        "emotion": most_common,
                        "confidence": round(avg_confidence, 2),
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    # Update lights based on emotion
                    if most_common in emotion_mappings:
                        light_state = emotion_mappings[most_common]
                        light_controller.set_light(light_state)
            
            await asyncio.sleep(0.5)  # Check every 500ms
            
        except Exception as e:
            print(f"Detection loop error: {e}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)