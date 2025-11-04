import React, { useState, useEffect } from 'react';

function RealTimeDebug() {
    const [messages, setMessages] = useState([]);
    const [wsStatus, setWsStatus] = useState('disconnected');

    useEffect(() => {
        console.log('🔧 Debug: Connecting to WebSocket...');
        const ws = new WebSocket('ws://localhost:8000/ws/emotions');

        ws.onopen = () => {
            console.log('🔧 Debug: WebSocket OPENED');
            setWsStatus('connected');
            addMessage('WebSocket connected', 'success');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('🔧 Debug: Message received:', data);
            addMessage(`${data.emotion} (${data.confidence.toFixed(1)}%)`, 'info');

            // Change document background to verify it's working
            const colors = {
                happy: '#FFD700',
                sad: '#4169E1',
                angry: '#FF0000',
                neutral: '#FFFFFF',
                surprise: '#FF69B4',
                fear: '#800080',
                disgust: '#9ACD32'
            };

            if (colors[data.emotion]) {
                document.body.style.backgroundColor = colors[data.emotion];
                document.body.style.transition = 'background-color 0.5s ease';
            }
        };

        ws.onerror = (error) => {
            console.error('🔧 Debug: WebSocket ERROR:', error);
            setWsStatus('error');
            addMessage('WebSocket error', 'error');
        };

        ws.onclose = () => {
            console.log('🔧 Debug: WebSocket CLOSED');
            setWsStatus('disconnected');
            addMessage('WebSocket disconnected', 'warning');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const addMessage = (text, type) => {
        setMessages(prev => [
            { text, type, time: new Date().toLocaleTimeString() },
            ...prev.slice(0, 19)
        ]);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '350px',
            maxHeight: '500px',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '14px' }}>
                🔧 Real-Time Debug Panel
            </div>
            <div style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '5px',
                background: wsStatus === 'connected' ? '#22c55e' : wsStatus === 'error' ? '#ef4444' : '#6b7280'
            }}>
                Status: {wsStatus.toUpperCase()}
            </div>
            <div style={{
                maxHeight: '350px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        padding: '0.5rem',
                        borderRadius: '5px',
                        background: msg.type === 'success' ? '#065f46' :
                            msg.type === 'error' ? '#7f1d1d' :
                                msg.type === 'warning' ? '#78350f' :
                                    '#1e293b'
                    }}>
                        <span style={{ opacity: 0.7 }}>[{msg.time}]</span> {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RealTimeDebug;
