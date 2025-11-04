import cv2
from deepface import DeepFace
import threading
from typing import Optional, Dict
import time

class EmotionDetector:
    def __init__(self, camera_index: int = 0):
        """Initialize the emotion detector with webcam"""
        self.camera_index = camera_index
        self.cap: Optional[cv2.VideoCapture] = None
        self.running = False
        self.current_emotion: Optional[Dict] = None
        self.lock = threading.Lock()
        
    def start(self):
        """Start the webcam and emotion detection"""
        if self.running:
            return
        
        self.cap = cv2.VideoCapture(self.camera_index)
        if not self.cap.isOpened():
            raise Exception("Could not open webcam")
        
        # Set camera properties for better performance
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        
        self.running = True
        print("Emotion detector started")
    
    def stop(self):
        """Stop the webcam and emotion detection"""
        self.running = False
        if self.cap:
            self.cap.release()
            self.cap = None
        print("Emotion detector stopped")
    
    def detect_emotion(self) -> Optional[Dict]:
        """
        Detect emotion from current webcam frame
        Returns: dict with 'emotion' and 'confidence' or None if no face detected
        """
        if not self.running or not self.cap:
            return None
        
        ret, frame = self.cap.read()
        if not ret:
            return None
        
        try:
            # Analyze face for emotions
            # enforce_detection=False allows processing even if face detector is uncertain
            result = DeepFace.analyze(
                frame, 
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv',
                silent=True
            )
            
            # DeepFace returns a list, get first result
            if isinstance(result, list):
                result = result[0]
            
            # Get dominant emotion
            emotions = result['emotion']
            dominant_emotion = result['dominant_emotion']
            confidence = emotions[dominant_emotion]
            
            emotion_data = {
                "emotion": dominant_emotion.lower(),
                "confidence": round(confidence, 2),
                "all_emotions": {k.lower(): round(v, 2) for k, v in emotions.items()}
            }
            
            with self.lock:
                self.current_emotion = emotion_data
            
            return emotion_data
            
        except Exception as e:
            # No face detected or other error
            print(f"Detection error: {e}")
            return None
    
    def get_current_emotion(self) -> Optional[Dict]:
        """Get the last detected emotion (thread-safe)"""
        with self.lock:
            return self.current_emotion

# Test the detector
if __name__ == "__main__":
    detector = EmotionDetector()
    detector.start()
    
    try:
        print("Testing emotion detection... Press Ctrl+C to stop")
        while True:
            result = detector.detect_emotion()
            if result:
                print(f"Detected: {result['emotion']} ({result['confidence']}%)")
            else:
                print("No face detected")
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        detector.stop()