import React from 'react';
import './EmotionDisplay.css';

const EMOTION_EMOJIS = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    surprise: '😮',
    fear: '😨',
};

function EmotionDisplay({ emotion, confidence, isRunning }) {
    return (
        <div className="emotion-display">
            <h2>Current Emotion</h2>
            <div className="emotion-card">
                <div className="emotion-emoji">
                    {EMOTION_EMOJIS[emotion] || '🤔'}
                </div>
                <div className="emotion-info">
                    <div className="emotion-name">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </div>
                    {isRunning && (
                        <div className="confidence-bar">
                            <div className="confidence-label">
                                Confidence: {confidence.toFixed(1)}%
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${confidence}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {!isRunning && (
                        <div className="not-running-msg">
                            Start detection to see emotions
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmotionDisplay;
