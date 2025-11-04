# Emotion-Based Lighting UI

A React-based user interface for the emotion detection system that changes background colors based on detected emotions.

## Features

- 🎥 **Live Camera Feed**: Real-time webcam display
- 🎭 **Emotion Detection**: Shows detected emotion and confidence level
- 🎨 **Customizable Light Settings**: Configure color, brightness, and transition speed for each emotion
- 🌈 **Dynamic Background**: Background color changes smoothly based on detected emotion
- ⚡ **Real-time Updates**: WebSocket connection for instant emotion updates

## Setup Instructions

### 1. Install Dependencies

Navigate to the frontend directory and install npm packages:

\`\`\`bash
cd frontend
npm install
\`\`\`

### 2. Start the Backend

Make sure your Python backend is running first:

\`\`\`bash
# In the root directory (not frontend)
cd ..
python main.py
\`\`\`

The backend should be running on `http://localhost:8000`

### 3. Start the React Development Server

In a new terminal, from the frontend directory:

\`\`\`bash
cd frontend
npm run dev
\`\`\`

The React app will start on `http://localhost:3000`

### 4. Open in Browser

Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Start Detection**: Click the "Start Detection" button to begin emotion detection
2. **Allow Camera Access**: Your browser will request camera permissions - allow it
3. **Customize Settings**: Click on any emotion in the right panel to expand and customize:
   - **Color**: Choose the background color for that emotion
   - **Brightness**: Adjust the brightness (0-100%)
   - **Transition Speed**: Set how fast the color transitions (0.1-5 seconds)
4. **Watch the Magic**: As emotions are detected, the background will smoothly transition to match your settings!

## Emotion Mappings

Default emotion settings:
- 😊 **Happy**: Gold color (#FFD700), bright
- 😢 **Sad**: Blue (#4169E1), dim
- 😠 **Angry**: Red (#FF0000), bright
- 😐 **Neutral**: White (#FFFFFF), medium
- 😮 **Surprise**: Pink (#FF69B4), very bright
- 😨 **Fear**: Purple (#800080), dim

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API calls
- **WebSocket**: Real-time emotion updates
- **Native Browser APIs**: Camera access via getUserMedia

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── CameraFeed.jsx       # Live camera display
│   │   ├── CameraFeed.css
│   │   ├── EmotionDisplay.jsx   # Current emotion & confidence
│   │   ├── EmotionDisplay.css
│   │   ├── EmotionSettings.jsx  # Customizable emotion settings
│   │   └── EmotionSettings.css
│   ├── App.jsx                   # Main app component
│   ├── App.css
│   ├── main.jsx                  # Entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
\`\`\`

## Tips

- The background color changes are smooth and respect your transition speed settings
- Changes to emotion settings are saved immediately and applied in real-time
- The currently active emotion is highlighted in the settings panel
- Camera feed runs entirely in the browser for privacy

## Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions in your browser
- Check that no other application is using the camera
- Try refreshing the page

**Background not changing?**
- Make sure the backend is running on port 8000
- Check the browser console for WebSocket connection errors
- Ensure detection is started (button should say "Stop Detection")

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Make sure you have Node.js version 16 or higher

## Future Enhancements

- Save/load custom emotion presets
- Export/import settings as JSON
- Multiple user profiles
- History of detected emotions
- Integration with real smart lights (Philips Hue, LIFX, etc.)
