import React, { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

const Navbar = ({ features, setFeatures, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const featureCategories = [
    {
      name: 'Weather Data',
      icon: '🌡️',
      features: [
        { key: 'airQuality', name: 'Air Quality Index', icon: '💨' },
        { key: 'pollenCount', name: 'Pollen Count', icon: '🌸' },
        { key: 'visibility', name: 'Visibility', icon: '👁️' },
        { key: 'pressure', name: 'Atmospheric Pressure', icon: '📊' },
        { key: 'dewPoint', name: 'Dew Point', icon: '💧' },
        { key: 'windCompass', name: 'Wind Compass', icon: '🧭' },
        { key: 'severeAlerts', name: 'Severe Alerts', icon: '⚠️' },
        { key: 'moonPhase', name: 'Moon Phase', icon: '🌙' }
      ]
    },
    {
      name: 'Visual',
      icon: '🎨',
      features: [
        { key: 'weatherCharts', name: 'Temperature Charts', icon: '📈' },
        { key: 'weatherRadar', name: 'Weather Radar', icon: '📡' },
        { key: 'weatherAnimations', name: 'Animations', icon: '✨' },
        { key: 'darkModeToggle', name: 'Dark Mode Toggle', icon: '🌓' },
        { key: 'customColors', name: 'Custom Colors', icon: '🎨' },
        { key: 'widgetMode', name: 'Widget Mode', icon: '📱' }
      ]
    },
    {
      name: 'Personal',
      icon: '👤',
      features: [
        { key: 'clothing', name: 'Clothing Advice', icon: '👕' },
        { key: 'activities', name: 'Activity Suggestions', icon: '🏃' },
        { key: 'bestTime', name: 'Best Times', icon: '⏰' },
        { key: 'countdownTimers', name: 'Countdowns', icon: '⏱️' },
        { key: 'goldenHour', name: 'Golden Hour', icon: '🌅' },
        { key: 'userProfiles', name: 'User Profiles', icon: '👥' },
        { key: 'commuteWeather', name: 'Commute Weather', icon: '🚗' },
        { key: 'weekendPlanner', name: 'Weekend Planner', icon: '📅' }
      ]
    },
    {
      name: 'Location',
      icon: '📍',
      features: [
        { key: 'gpsLocation', name: 'GPS Location', icon: '🛰️' },
        { key: 'nearbyCities', name: 'Nearby Cities', icon: '🏙️' },
        { key: 'routeWeather', name: 'Route Weather', icon: '🗺️' },
        { key: 'comparison', name: 'Compare Locations', icon: '⚖️' }
      ]
    },
    {
      name: 'Notifications',
      icon: '🔔',
      features: [
        { key: 'customReminders', name: 'Custom Reminders', icon: '⏰' },
        { key: 'dailyEmail', name: 'Daily Email', icon: '📧' },
        { key: 'pushNotifications', name: 'Push Notifications', icon: '📲' }
      ]
    },
    {
      name: 'Social & Fun',
      icon: '🎉',
      features: [
        { key: 'share', name: 'Share Weather', icon: '🔗' },
        { key: 'achievements', name: 'Achievements', icon: '🏆' },
        { key: 'streaks', name: 'Weather Streaks', icon: '🔥' },
        { key: 'quiz', name: 'Weather Quiz', icon: '❓' },
        { key: 'weatherStories', name: 'Weather Stories', icon: '📖' }
      ]
    },
    {
      name: 'Integration',
      icon: '🔧',
      features: [
        { key: 'calendarIntegration', name: 'Calendar', icon: '📆' },
        { key: 'seasonalStats', name: 'Seasonal Stats', icon: '📊' },
        { key: 'exportData', name: 'Export Data', icon: '💾' },
        { key: 'voiceCommands', name: 'Voice Commands', icon: '🎤' },
        { key: 'offlineMode', name: 'Offline Mode', icon: '📴' }
      ]
    }
  ];

  const toggleFeature = (featureKey) => {
    setFeatures({ ...features, [featureKey]: !features[featureKey] });
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const getEnabledCount = () => {
    return Object.values(features).filter(v => v).length;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-36 left-4 z-[10001] p-3 ${theme.card} rounded-xl border border-white/20 ${theme.text} hover:scale-105 transition-all shadow-lg`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed top-48 left-0 h-[calc(100%-12rem)] w-80 ${theme.card} border-r border-white/20 z-[10000] transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>🌟 Features</h2>
            <p className={`text-sm ${theme.text} opacity-70`}>
              Toggle features on/off • {getEnabledCount()} active
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => {
                const allEnabled = Object.keys(features).reduce((acc, key) => ({...acc, [key]: true}), {});
                setFeatures(allEnabled);
              }}
              className={`flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors`}
            >
              Enable All
            </button>
            <button
              onClick={() => {
                const allDisabled = Object.keys(features).reduce((acc, key) => ({...acc, [key]: false}), {});
                setFeatures(allDisabled);
              }}
              className={`flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors`}
            >
              Disable All
            </button>
          </div>

          {/* Feature Categories */}
          <div className="space-y-3">
            {featureCategories.map((category) => (
              <div key={category.name} className="border border-white/10 rounded-xl overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`w-full p-3 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className={`font-semibold ${theme.text}`}>{category.name}</span>
                    <span className={`text-xs ${theme.text} opacity-50`}>
                      ({category.features.filter(f => features[f.key]).length}/{category.features.length})
                    </span>
                  </div>
                  {expandedCategory === category.name ? (
                    <ChevronDown className={theme.text} size={20} />
                  ) : (
                    <ChevronRight className={theme.text} size={20} />
                  )}
                </button>

                {/* Category Features */}
                {expandedCategory === category.name && (
                  <div className="p-2 space-y-1">
                    {category.features.map((feature) => (
                      <button
                        key={feature.key}
                        onClick={() => toggleFeature(feature.key)}
                        className={`w-full p-2 rounded-lg flex items-center justify-between transition-all ${
                          features[feature.key]
                            ? 'bg-green-500/20 hover:bg-green-500/30'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{feature.icon}</span>
                          <span className={`text-sm ${theme.text}`}>{feature.name}</span>
                        </div>
                        <div
                          className={`w-10 h-5 rounded-full transition-colors ${
                            features[feature.key] ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 bg-white rounded-full transition-transform ${
                              features[feature.key] ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className={`mt-6 p-4 bg-white/5 rounded-xl border border-white/10`}>
            <p className={`text-xs ${theme.text} opacity-70 text-center`}>
              💡 Tip: Disable unused features to improve performance
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
