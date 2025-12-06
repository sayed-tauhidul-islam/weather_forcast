import React from 'react';
import { ShirtIcon } from 'lucide-react';

export default function ClothingRecommendation({ temperature, weatherCode, theme }) {
  const getClothingAdvice = (temp, code) => {
    const tempC = parseFloat(temp);
    let advice = [];
    let icon = '👕';

    if (tempC < 0) {
      advice = ['Heavy winter coat', 'Thick scarf', 'Warm gloves', 'Winter boots', 'Thermal layers'];
      icon = '🧥';
    } else if (tempC < 10) {
      advice = ['Jacket or coat', 'Long pants', 'Closed shoes', 'Light scarf'];
      icon = '🧥';
    } else if (tempC < 20) {
      advice = ['Light jacket', 'Long sleeves', 'Comfortable pants', 'Sneakers'];
      icon = '👔';
    } else if (tempC < 30) {
      advice = ['T-shirt', 'Shorts or light pants', 'Sunglasses', 'Light shoes'];
      icon = '👕';
    } else {
      advice = ['Light breathable clothes', 'Shorts', 'Sandals', 'Hat', 'Sunscreen'];
      icon = '🩳';
    }

    // Weather-specific additions
    if ([61, 63, 65, 80, 81, 82].includes(code)) {
      advice.unshift('☂️ Umbrella');
      advice.push('Waterproof jacket');
    }
    if ([71, 73, 75, 85, 86].includes(code)) {
      advice.unshift('❄️ Snow boots');
      advice.push('Waterproof gloves');
    }
    if ([95, 96, 99].includes(code)) {
      advice.unshift('⚠️ Stay indoors if possible');
    }

    return { advice, icon };
  };

  const clothing = getClothingAdvice(temperature, weatherCode);

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <span className="text-2xl">{clothing.icon}</span>
        What to Wear
      </h3>
      <div className="space-y-3">
        {clothing.advice.map((item, index) => (
          <div key={index} className={`${theme.card} rounded-xl p-4 border border-white/20 ${theme.text}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
