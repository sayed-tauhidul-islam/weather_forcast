import React from 'react';
import { Share2, Download, Copy } from 'lucide-react';

export default function ShareWeather({ weather, city, theme }) {
  const shareToSocial = (platform) => {
    const text = `Weather in ${city}: ${Math.round(weather.current.temperature_2m)}°C`;
    const url = window.location.href;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    const text = `Weather in ${city}: ${Math.round(weather.current.temperature_2m)}°C\n${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadScreenshot = () => {
    // Simple implementation - in production, use html2canvas
    alert('Screenshot feature - Use browser screenshot tool (Ctrl+Shift+S)');
  };

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Share2 className="w-6 h-6" />
        Share Weather
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => shareToSocial('twitter')}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <div className="text-3xl mb-2">𝕏</div>
          Twitter
        </button>
        <button
          onClick={() => shareToSocial('facebook')}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <div className="text-3xl mb-2">📘</div>
          Facebook
        </button>
        <button
          onClick={() => shareToSocial('whatsapp')}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <div className="text-3xl mb-2">💬</div>
          WhatsApp
        </button>
        <button
          onClick={() => shareToSocial('telegram')}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <div className="text-3xl mb-2">✈️</div>
          Telegram
        </button>
        <button
          onClick={copyToClipboard}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <Copy className="w-6 h-6 mx-auto mb-2" />
          Copy Link
        </button>
        <button
          onClick={downloadScreenshot}
          className={`${theme.card} rounded-xl p-4 border border-white/20 hover:scale-105 transition-all ${theme.text}`}
        >
          <Download className="w-6 h-6 mx-auto mb-2" />
          Screenshot
        </button>
      </div>
    </div>
  );
}
