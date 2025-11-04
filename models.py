from pydantic import BaseModel, Field
from typing import Optional

class LightState(BaseModel):
    """Represents a light state configuration"""
    color: str = Field(..., description="Hex color code (e.g., #FF0000)")
    brightness: int = Field(..., ge=0, le=100, description="Brightness percentage (0-100)")
    transition_speed: float = Field(..., gt=0, description="Transition duration in seconds")

class EmotionMapping(BaseModel):
    """Represents an emotion to light mapping"""
    color: str = Field(..., description="Hex color code")
    brightness: int = Field(..., ge=0, le=100)
    transition_speed: float = Field(..., gt=0)

class SystemStatus(BaseModel):
    """Represents the system status"""
    is_running: bool = Field(..., description="Whether detection is running")
    current_emotion: str = Field(..., description="Current detected emotion")
    confidence: float = Field(..., description="Confidence level (0-100)")
    timestamp: Optional[str] = Field(None, description="Timestamp of last detection")