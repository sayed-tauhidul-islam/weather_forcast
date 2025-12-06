import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceCommands = ({ setCity, theme }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      
      // Process commands
      if (text.includes('weather in')) {
        const city = text.split('weather in')[1].trim();
        setCity(city);
      } else if (text.includes('temperature')) {
        setTranscript('Showing temperature');
      }
      
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    }

    return () => recognition.stop();
  }, [isListening, setCity]);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Mic className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Voice Commands</h3>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => setIsListening(!isListening)}
          className={`w-24 h-24 rounded-full mx-auto mb-4 transition-all ${
            isListening
              ? 'bg-red-500 animate-pulse'
              : `bg-gradient-to-r ${theme.accent}`
          }`}
        >
          {isListening ? (
            <MicOff className="text-white mx-auto" size={40} />
          ) : (
            <Mic className="text-white mx-auto" size={40} />
          )}
        </button>
        
        <div className={`text-lg font-semibold ${theme.text} mb-2`}>
          {isListening ? '🎤 Listening...' : 'Tap to speak'}
        </div>
        
        {transcript && (
          <div className={`mt-4 p-3 bg-white/5 rounded-xl text-sm ${theme.text}`}>
            "{transcript}"
          </div>
        )}
        
        <div className={`mt-4 text-sm ${theme.text} opacity-70`}>
          Try: "Weather in Paris" or "Show temperature"
        </div>
      </div>
    </div>
  );
};

export default VoiceCommands;
