import React, { useState } from 'react';
import './EmotionSettings.css';

const EMOTION_EMOJIS = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    surprise: '😮',
    fear: '😨',
    disgust: '🤢',
}; function EmotionSettings({ mappings, onUpdateMapping, currentEmotion }) {
    const [expandedEmotion, setExpandedEmotion] = useState(null);

    const handleColorChange = (emotion, color) => {
        onUpdateMapping(emotion, {
            ...mappings[emotion],
            color,
        });
    };

    const handleBrightnessChange = (emotion, brightness) => {
        onUpdateMapping(emotion, {
            ...mappings[emotion],
            brightness: parseInt(brightness),
        });
    };

    const handleSpeedChange = (emotion, speed) => {
        onUpdateMapping(emotion, {
            ...mappings[emotion],
            transition_speed: parseFloat(speed),
        });
    };

    const toggleExpand = (emotion) => {
        setExpandedEmotion(expandedEmotion === emotion ? null : emotion);
    };

    return (
        <div className="emotion-settings">
            <h2>⚙️ Light Preferences</h2>
            <p className="settings-description">
                Customize the lighting for each emotion
            </p>

            <div className="settings-list">
                {Object.keys(mappings).map((emotion) => {
                    const mapping = mappings[emotion];
                    const isExpanded = expandedEmotion === emotion;
                    const isActive = currentEmotion === emotion;

                    return (
                        <div
                            key={emotion}
                            className={`emotion-setting ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''
                                }`}
                        >
                            <div
                                className="setting-header"
                                onClick={() => toggleExpand(emotion)}
                            >
                                <div className="setting-header-left">
                                    <span className="emotion-emoji-small">
                                        {EMOTION_EMOJIS[emotion] || '🤔'}
                                    </span>
                                    <span className="emotion-label">
                                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                                    </span>
                                    {isActive && <span className="active-badge">Active</span>}
                                </div>
                                <div className="setting-header-right">
                                    <div
                                        className="color-preview"
                                        style={{ backgroundColor: mapping.color }}
                                    ></div>
                                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="setting-controls">
                                    <div className="control-group">
                                        <label>
                                            Color
                                            <input
                                                type="color"
                                                value={mapping.color}
                                                onChange={(e) =>
                                                    handleColorChange(emotion, e.target.value)
                                                }
                                                className="color-input"
                                            />
                                        </label>
                                        <span className="color-hex">{mapping.color}</span>
                                    </div>

                                    <div className="control-group">
                                        <label>
                                            Brightness: {mapping.brightness}%
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={mapping.brightness}
                                                onChange={(e) =>
                                                    handleBrightnessChange(emotion, e.target.value)
                                                }
                                                className="slider"
                                            />
                                        </label>
                                    </div>

                                    <div className="control-group">
                                        <label>
                                            Transition Speed: {mapping.transition_speed}s
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="5"
                                                step="0.1"
                                                value={mapping.transition_speed}
                                                onChange={(e) =>
                                                    handleSpeedChange(emotion, e.target.value)
                                                }
                                                className="slider"
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EmotionSettings;
