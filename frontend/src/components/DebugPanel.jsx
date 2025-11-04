import React, { useState, useEffect } from 'react';

function DebugPanel() {
    const [backendStatus, setBackendStatus] = useState(null);
    const [wsMessages, setWsMessages] = useState([]);
    const [wsConnected, setWsConnected] = useState(false);

    useEffect(() => {
        // Check backend status every 2 seconds
        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8000/api/status');
                const data = await response.json();
                setBackendStatus(data);
            } catch (error) {
                setBackendStatus({ error: error.message });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const connectWebSocket = () => {
        const ws = new WebSocket('ws://localhost:8000/ws/emotions');

        ws.onopen = () => {
            setWsConnected(true);
            addMessage('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addMessage(`Emotion: ${data.emotion}, Confidence: ${data.confidence}%`);
        };

        ws.onerror = (error) => {
            addMessage(`Error: ${error.message}`);
        };

        ws.onclose = () => {
            setWsConnected(false);
            addMessage('WebSocket disconnected');
        };
    };

    const addMessage = (msg) => {
        setWsMessages(prev => [
            `[${new Date().toLocaleTimeString()}] ${msg}`,
            ...prev
        ].slice(0, 20));
    };

    const startDetection = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/start-detection', {
                method: 'POST'
            });
            const data = await response.json();
            addMessage(`Start detection: ${JSON.stringify(data)}`);
        } catch (error) {
            addMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🔍 Debug Panel</h1>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Backend Status</h2>
                <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
                    {JSON.stringify(backendStatus, null, 2)}
                </pre>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button onClick={startDetection} style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
                    Start Detection
                </button>
                <button onClick={connectWebSocket} disabled={wsConnected} style={{ padding: '0.5rem 1rem' }}>
                    {wsConnected ? 'WebSocket Connected' : 'Connect WebSocket'}
                </button>
            </div>

            <div>
                <h2>WebSocket Messages</h2>
                <div style={{ background: '#000', color: '#0f0', padding: '1rem', borderRadius: '8px', height: '300px', overflow: 'auto' }}>
                    {wsMessages.map((msg, i) => (
                        <div key={i}>{msg}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DebugPanel;
