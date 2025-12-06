import React from 'react';
import { Zap } from 'lucide-react';

export default function ActivitySuggestions({ weather, theme }) {
  const getSuggestions = (temp, code, windSpeed, precipitation) => {
    const tempC = parseFloat(temp);
    const outdoor = [];
    const indoor = [];

    // Good weather activities
    if (tempC > 15 && tempC < 30 && code < 3 && windSpeed < 20 && precipitation < 20) {
      outdoor.push('🚴 Cycling', '🏃 Running', '⚽ Sports', '🧺 Picnic', '📸 Photography');
    }

    // Hot weather
    if (tempC > 30) {
      outdoor.push('🏊 Swimming', '🍦 Get ice cream', '💦 Water activities');
      indoor.push('🏛️ Visit museums', '🎬 Watch movies', '🛍️ Shopping mall');
    }

    // Rainy weather
    if ([61, 63, 65, 80, 81, 82].includes(code) || precipitation > 60) {
      indoor.push('📚 Read books', '🎮 Play games', '🍿 Movie marathon', '🧘 Yoga', '🍳 Cook something new');
      outdoor.push('☔ Puddle jumping (if light rain)');
    }

    // Cold weather
    if (tempC < 10) {
      indoor.push('☕ Hot drinks at café', '🎨 Arts & crafts', '🎲 Board games');
      outdoor.push('⛷️ Winter sports', '⛸️ Ice skating');
    }

    // Snowy weather
    if ([71, 73, 75, 85, 86].includes(code)) {
      outdoor.push('⛷️ Skiing', '⛸️ Ice skating', '☃️ Build snowman', '🎿 Sledding');
    }

    // Windy weather
    if (windSpeed > 25) {
      outdoor.push('🪁 Kite flying');
    }

    // Default activities
    if (outdoor.length === 0) {
      outdoor.push('🚶 Walking', '🌳 Park visit', '📷 Photography');
    }
    if (indoor.length === 0) {
      indoor.push('📖 Reading', '🎨 Creative projects', '🎵 Listen to music');
    }

    return { outdoor, indoor };
  };

  const suggestions = getSuggestions(
    weather.current.temperature_2m,
    weather.current.weather_code,
    weather.current.wind_speed_10m,
    weather.hourly.precipitation_probability[0]
  );

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Zap className="w-6 h-6" />
        Activity Suggestions
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className={`text-lg font-semibold ${theme.text} mb-3`}>🌤️ Outdoor Activities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.outdoor.map((activity, index) => (
              <div key={index} className={`${theme.card} rounded-xl p-3 border border-white/20 ${theme.text} text-center`}>
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className={`text-lg font-semibold ${theme.text} mb-3`}>🏠 Indoor Activities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.indoor.map((activity, index) => (
              <div key={index} className={`${theme.card} rounded-xl p-3 border border-white/20 ${theme.text} text-center`}>
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
