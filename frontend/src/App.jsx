import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import EmotionSettings from './components/EmotionSettings';
import CameraFeed from './components/CameraFeed';
import EmotionDisplay from './components/EmotionDisplay';
import RealTimeDebug from './components/RealTimeDebug';

const API_BASE = 'http://localhost:8000';

const DEFAULT_MAPPINGS = {
    happy: { color: '#FFD700', brightness: 100, transition_speed: 1.0 },
    sad: { color: '#4169E1', brightness: 30, transition_speed: 2.0 },
    angry: { color: '#FF0000', brightness: 80, transition_speed: 0.5 },
    neutral: { color: '#FFFFFF', brightness: 50, transition_speed: 1.5 },
    surprise: { color: '#FF69B4', brightness: 90, transition_speed: 0.3 },
    fear: { color: '#800080', brightness: 40, transition_speed: 0.8 },
    disgust: { color: '#9ACD32', brightness: 60, transition_speed: 1.0 },
};

function App() {
    const [isRunning, setIsRunning] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const [confidence, setConfidence] = useState(0);
    const [emotionMappings, setEmotionMappings] = useState(DEFAULT_MAPPINGS);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [brightness, setBrightness] = useState(50);
    const [wsConnected, setWsConnected] = useState(false);
    const wsRef = useRef(null);
    const pollIntervalRef = useRef(null);

    // Helper function to update background
    const updateBackground = useCallback((color, brightness, transitionSpeed) => {
        console.log('🎨 updateBackground called:', { color, brightness, transitionSpeed });
        const root = document.getElementById('root');
        if (root) {
            root.style.transition = `background-color ${transitionSpeed}s ease`;

            // Convert brightness to opacity
            const opacity = brightness / 100;
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

            root.style.backgroundColor = bgColor;
            console.log('✅ Background updated to:', bgColor);
        }
    }, []);

    // Handle emotion updates - memoized to prevent stale closures
    const handleEmotionUpdate = useCallback((emotion, confidence) => {
        console.log('🎭 handleEmotionUpdate:', emotion, confidence);
        setCurrentEmotion(emotion);
        setConfidence(confidence);

        const mapping = emotionMappings[emotion];
        if (mapping) {
            console.log('Found mapping for', emotion, ':', mapping);
            updateBackground(mapping.color, mapping.brightness, mapping.transition_speed);
        } else {
            console.warn('⚠️ No mapping found for emotion:', emotion);
        }
    }, [emotionMappings, updateBackground]);

    // Polling function - memoized with proper dependencies
    const startPolling = useCallback(() => {
        // Clear any existing polling first
        if (pollIntervalRef.current) {
            console.log('Clearing existing poll interval');
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        console.log('📡 Starting HTTP polling');
        pollIntervalRef.current = setInterval(async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/status`);
                const data = response.data;
                console.log('� Polled data:', data);

                if (data.is_running && data.current_emotion && data.current_emotion !== 'none') {
                    handleEmotionUpdate(data.current_emotion, data.confidence);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 500);
    }, [handleEmotionUpdate]);

    // Connect to WebSocket for real-time emotion updates
    useEffect(() => {
        console.log('🔄 WebSocket useEffect triggered. isRunning:', isRunning);

        if (!isRunning) {
            console.log('Detection not running - cleaning up');
            // Clean up polling if detection is stopped
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
            setWsConnected(false);
            return;
        }

        console.log('Attempting to connect WebSocket...');
        const ws = new WebSocket(`ws://localhost:8000/ws/emotions`);

        ws.onopen = () => {
            console.log('✅ WebSocket connected successfully!');
            setWsConnected(true);
            // Clear polling if it was started
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                console.log('Stopped polling - WebSocket connected');
            }
            startPolling();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('� Received WebSocket data:', data);
            startPolling();

            if (data.emotion && data.emotion !== 'none') {
                handleEmotionUpdate(data.emotion, data.confidence);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            console.log('Falling back to polling...');
            startPolling();
        };

        ws.onclose = () => {
            console.log('🔌 WebSocket disconnected');
            setWsConnected(false);
        };

        wsRef.current = ws;

        // Start polling after 2 seconds if WebSocket hasn't connected
        const fallbackTimer = setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                console.log('⚠️ WebSocket not connected after 2s, starting polling');
                startPolling();
            }
        }, 2000);

        return () => {
            console.log('Cleaning up WebSocket and polling...');
            clearTimeout(fallbackTimer);
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [isRunning]);

    const startDetection = async () => {
        try {
            console.log('Starting detection...');
            const response = await axios.post(`${API_BASE}/api/start-detection`);
            console.log('Detection started:', response.data);
            setIsRunning(true);
            console.log('isRunning set to true');
        } catch (error) {
            console.error('Error starting detection:', error);
            alert('Failed to start detection. Make sure the backend is running.');
        }
    };

    const stopDetection = async () => {
        try {
            await axios.post(`${API_BASE}/api/stop-detection`);
            setIsRunning(false);
            // Reset to neutral
            updateBackground('#FFFFFF', 50, 1.5);
            setCurrentEmotion('neutral');
            setConfidence(0);
        } catch (error) {
            console.error('Error stopping detection:', error);
        }
    };

    const updateEmotionMapping = async (emotion, mapping) => {
        const updatedMappings = {
            ...emotionMappings,
            [emotion]: mapping,
        };
        setEmotionMappings(updatedMappings);

        try {
            await axios.post(`${API_BASE}/api/mappings/${emotion}`, mapping);

            // If this is the current emotion, update background immediately
            if (emotion === currentEmotion) {
                updateBackground(mapping.color, mapping.brightness, mapping.transition_speed);
            }
        } catch (error) {
            console.error('Error updating mapping:', error);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <header className="header">
                    <h1>🎭 Emotion-Based Lighting</h1>
                    <p className="subtitle">Your emotions, your ambiance</p>
                    {isRunning && (
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            background: wsConnected ? '#4ade80' : '#f87171',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginTop: '0.5rem'
                        }}>
                            {wsConnected ? '🟢 Connected' : '🔴 Connecting...'}
                        </div>
                    )}
                </header>

                <div className="main-content">
                    <div className="left-panel">
                        <CameraFeed isRunning={isRunning} />

                        <EmotionDisplay
                            emotion={currentEmotion}
                            confidence={confidence}
                            isRunning={isRunning}
                        />

                        {/* Debug panel - remove this after testing */}
                        {/* {isRunning && <RealTimeDebug />} */}

                        <div className="control-panel">
                            <button
                                className={`control-btn ${isRunning ? 'stop' : 'start'}`}
                                onClick={isRunning ? stopDetection : startDetection}
                            >
                                {isRunning ? '⏹ Stop Detection' : '▶ Start Detection'}
                            </button>
                        </div>
                    </div>

                    <div className="right-panel">
                        <EmotionSettings
                            mappings={emotionMappings}
                            onUpdateMapping={updateEmotionMapping}
                            currentEmotion={currentEmotion}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
