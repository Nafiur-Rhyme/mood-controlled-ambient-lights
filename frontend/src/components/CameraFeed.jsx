import React, { useEffect, useRef } from 'react';
import './CameraFeed.css';

function CameraFeed({ isRunning }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isRunning]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please ensure camera permissions are granted.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    return (
        <div className="camera-feed">
            <h2>📹 Live Camera Feed</h2>
            <div className="video-container">
                {isRunning ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="video"
                    />
                ) : (
                    <div className="video-placeholder">
                        <div className="placeholder-content">
                            <span className="camera-icon">📷</span>
                            <p>Camera Off</p>
                            <small>Start detection to enable camera</small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CameraFeed;
