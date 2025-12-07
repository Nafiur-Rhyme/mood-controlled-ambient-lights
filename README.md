# 🎭 Mood-Controlled Ambient Lights

An intelligent emotion detection system that dynamically adjusts ambient lighting based on your facial expressions in real-time. Built with FastAPI, DeepFace, and React.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)

## ✨ Features

- **Real-time Emotion Detection** - Uses DeepFace and OpenCV to detect 6 emotions: happy, sad, angry, neutral, surprise, and fear
- **Dynamic Background Colors** - Smooth color transitions based on detected emotions
- **Customizable Settings** - Adjust color, brightness, and transition speed for each emotion
- **Majority Voting Algorithm** - Smooths emotion detection by analyzing the most frequent emotion over a 3-second window
- **WebSocket Support** - Real-time updates with automatic HTTP polling fallback
- **Responsive UI** - Modern, compact interface built with React
- **Live Camera Feed** - Browser-based webcam display for visual feedback

## 🏗️ Architecture

### Backend (Python)
- **FastAPI** - High-performance async web framework
- **DeepFace** - Deep learning facial emotion recognition
- **OpenCV** - Computer vision and camera handling
- **WebSocket** - Real-time bidirectional communication

### Frontend (React)
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **WebSocket API** - Real-time emotion updates

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Webcam/Camera
- Modern web browser with camera permissions

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nafiur-Rhyme/mood-controlled-ambient-lights.git
cd mood-controlled-ambient-lights
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🎮 Usage

### Start the Backend Server

```bash
# From the root directory
python main.py
```

or 

```bash
# From the root directory
uvicorn main:app --host 0.0.0.0 --port 8000
```


The backend API will start on `http://localhost:8000`

### Start the Frontend Development Server

```bash
# In a new terminal, from the frontend directory
cd frontend
npm run dev
```

The React app will start on `http://localhost:3000`

### Using the Application

1. Open `http://localhost:3000` in your browser
2. Click **"Start Detection"** button
3. Allow camera access when prompted
4. Your emotion will be detected in real-time
5. The background color will change based on your emotion
6. Customize emotion settings in the right panel:
   - Click any emotion to expand settings
   - Adjust color, brightness, and transition speed
   - Changes apply immediately

## 🎨 Default Emotion Mappings

| Emotion  | Color   | Brightness | Speed |
|----------|---------|------------|-------|
| 😊 Happy    | Gold (#FFD700)   | 100%  | 1.0s  |
| 😢 Sad      | Blue (#4169E1)   | 30%   | 2.0s  |
| 😠 Angry    | Red (#FF0000)    | 80%   | 0.5s  |
| 😐 Neutral  | White (#FFFFFF)  | 50%   | 1.5s  |
| 😮 Surprise | Pink (#FF69B4)   | 90%   | 0.3s  |
| 😨 Fear     | Purple (#800080) | 40%   | 0.8s  |

## 🔧 API Endpoints

### REST API

- `GET /` - Health check
- `GET /api/status` - Get system status and current emotion
- `POST /api/start-detection` - Start emotion detection
- `POST /api/stop-detection` - Stop emotion detection
- `GET /api/mappings` - Get all emotion mappings
- `POST /api/mappings/{emotion}` - Update specific emotion mapping

### WebSocket

- `WS /ws/emotions` - Real-time emotion updates (500ms interval)

## 📁 Project Structure

```
mood-controlled-ambient-lights/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── CameraFeed.jsx
│   │   │   ├── EmotionDisplay.jsx
│   │   │   ├── EmotionSettings.jsx
│   │   │   └── RealTimeDebug.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── emotion_detector.py      # Emotion detection logic
├── light_controller.py      # Light control interface
├── main.py                  # FastAPI backend
├── models.py                # Pydantic models
├── requirements.txt         # Python dependencies
└── README.md
```

## 🧠 How It Works

### Emotion Detection Pipeline

1. **Camera Capture** - OpenCV captures frames from webcam at ~2 FPS
2. **Face Analysis** - DeepFace analyzes facial features using deep learning
3. **Emotion Classification** - Classifies into 6 emotion categories with confidence scores
4. **Majority Voting** - Tracks last 6 detections (~3 seconds) and selects most frequent emotion
5. **Confidence Averaging** - Calculates average confidence for the selected emotion
6. **Update Broadcast** - Sends emotion via WebSocket to all connected clients
7. **UI Update** - React frontend updates background color with smooth transitions

### Smoothing Algorithm

```python
# Maintains history of last 6 detections
emotion_history = []

# Find most common emotion
most_common = max(set(emotions), key=emotions.count)

# Average confidence for that emotion
avg_confidence = sum(confidence for emotion in history 
                    if emotion == most_common) / count
```

This prevents flickering and ensures stable emotion detection.

## 🛠️ Configuration

### Backend Configuration

Edit `main.py` to customize:
- Default emotion mappings
- WebSocket update interval
- History size for smoothing
- CORS origins

### Frontend Configuration

Edit `frontend/src/App.jsx` to customize:
- Default colors and brightness
- API base URL
- Polling intervals
- UI appearance

## 🐛 Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted in browser
- Check if another application is using the camera
- Verify webcam is properly connected

### Backend Connection Issues
- Confirm backend is running on port 8000
- Check firewall settings
- Verify Python dependencies are installed

### Emotions Not Updating
- Check browser console for WebSocket errors
- Ensure detection is started (green indicator)
- Verify adequate lighting for face detection
- Look directly at the camera

### Performance Issues
- Reduce camera resolution in `emotion_detector.py`
- Increase detection interval
- Close other resource-intensive applications

## 🚧 Future Enhancements

- [ ] Integration with smart home devices (Philips Hue, LIFX)
- [ ] Support for multiple users
- [ ] Emotion history and analytics dashboard
- [ ] Custom emotion profiles/presets
- [ ] Mobile app support
- [ ] Voice control integration
- [ ] Camera rotation/flip options
- [ ] Recording and playback features

## 📝 Requirements

See `requirements.txt` for Python dependencies:
- fastapi
- uvicorn
- opencv-python
- deepface
- tensorflow
- websockets
- pydantic

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Nafiur Rhyme**
- GitHub: [@Nafiur-Rhyme](https://github.com/Nafiur-Rhyme)

## 🙏 Acknowledgments

- [DeepFace](https://github.com/serengil/deepface) - Deep learning facial analysis
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [React](https://react.dev/) - UI library
- [OpenCV](https://opencv.org/) - Computer vision library

## 📊 Performance

- **Detection Speed**: ~2 FPS (configurable)
- **WebSocket Latency**: <100ms
- **UI Response Time**: <200ms
- **CPU Usage**: 15-25% (depends on hardware)
- **Memory Usage**: ~500MB

## 🔐 Privacy

All emotion detection happens **locally** on your machine. No video or emotion data is sent to external servers. The webcam feed is processed in real-time and not stored.

---

Made for Advanced Interaction Techniques course at Memorial University of Newfoundland
