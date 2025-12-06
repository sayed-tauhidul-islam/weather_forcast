import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export default function FeatureManager({ features, setFeatures, theme }) {
  const featureList = [
    // Weather Data (8 features)
    { id: 'airQuality', name: 'Air Quality Index', category: 'Data' },
    { id: 'pollenCount', name: 'Pollen Count', category: 'Data' },
    { id: 'visibility', name: 'Visibility', category: 'Data' },
    { id: 'pressure', name: 'Atmospheric Pressure', category: 'Data' },
    { id: 'dewPoint', name: 'Dew Point', category: 'Data' },
    { id: 'windCompass', name: 'Wind Compass', category: 'Data' },
    { id: 'severeAlerts', name: 'Severe Weather Alerts', category: 'Data' },
    { id: 'moonPhase', name: 'Moon Phase', category: 'Data' },
    
    // Visual Enhancements (6 features)
    { id: 'weatherCharts', name: 'Temperature Charts', category: 'Visual' },
    { id: 'weatherRadar', name: 'Weather Radar', category: 'Visual' },
    { id: 'weatherAnimations', name: 'Weather Animations', category: 'Visual' },
    { id: 'darkModeToggle', name: 'Dark Mode Toggle', category: 'Visual' },
    { id: 'customColors', name: 'Custom Colors', category: 'Visual' },
    { id: 'widgetMode', name: 'Widget Mode', category: 'Visual' },
    
    // Personal Features (8 features)
    { id: 'clothing', name: 'Clothing Recommendations', category: 'Personal' },
    { id: 'activities', name: 'Activity Suggestions', category: 'Personal' },
    { id: 'bestTime', name: 'Best Time Recommendations', category: 'Personal' },
    { id: 'countdownTimers', name: 'Weather Countdowns', category: 'Personal' },
    { id: 'goldenHour', name: 'Golden Hour Times', category: 'Personal' },
    { id: 'userProfiles', name: 'User Profiles', category: 'Personal' },
    { id: 'commuteWeather', name: 'Commute Weather', category: 'Personal' },
    { id: 'weekendPlanner', name: 'Weekend Planner', category: 'Personal' },
    
    // Location Based (4 features)
    { id: 'gpsLocation', name: 'GPS Auto-Location', category: 'Location' },
    { id: 'nearbyCities', name: 'Nearby Cities', category: 'Location' },
    { id: 'routeWeather', name: 'Weather Along Route', category: 'Location' },
    { id: 'comparison', name: 'Location Comparison', category: 'Location' },
    
    // Notifications (3 features)
    { id: 'customReminders', name: 'Custom Reminders', category: 'Notifications' },
    { id: 'dailyEmail', name: 'Daily Email Forecast', category: 'Notifications' },
    { id: 'pushNotifications', name: 'Push Notifications', category: 'Notifications' },
    
    // Social & Fun (5 features)
    { id: 'share', name: 'Weather Sharing', category: 'Social & Fun' },
    { id: 'achievements', name: 'Weather Achievements', category: 'Social & Fun' },
    { id: 'streaks', name: 'Weather Streaks', category: 'Social & Fun' },
    { id: 'quiz', name: 'Weather Quiz', category: 'Social & Fun' },
    { id: 'weatherStories', name: 'Weather Stories', category: 'Social & Fun' },
    
    // Integration & Utility (5 features)
    { id: 'calendarIntegration', name: 'Calendar Integration', category: 'Integration' },
    { id: 'seasonalStats', name: 'Seasonal Statistics', category: 'Integration' },
    { id: 'exportData', name: 'Export Weather Data', category: 'Integration' },
    { id: 'voiceCommands', name: 'Voice Commands', category: 'Integration' },
    { id: 'offlineMode', name: 'Offline Mode', category: 'Integration' }
  ];

  const categories = [...new Set(featureList.map(f => f.category))];

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6`}>🎛️ Feature Manager (46 Features)</h3>
      
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h4 className={`text-lg font-semibold ${theme.text} mb-3`}>{category} Features</h4>
          <div className="space-y-2">
            {featureList.filter(f => f.category === category).map(feature => (
              <div 
                key={feature.id}
                className={`${theme.card} rounded-xl p-4 border border-white/20 flex items-center justify-between`}
              >
                <span className={theme.text}>{feature.name}</span>
                <button
                  onClick={() => setFeatures({ ...features, [feature.id]: !features[feature.id] })}
                  className="transition-all"
                >
                  {features[feature.id] ? (
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

