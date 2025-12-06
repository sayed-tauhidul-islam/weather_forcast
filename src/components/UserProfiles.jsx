import React, { useState } from 'react';
import { User, Settings } from 'lucide-react';

const UserProfiles = ({ theme }) => {
  const [profiles] = useState([
    { name: 'Work', preferences: { temp: 'C', wind: 'km/h', notifications: true }, icon: '💼' },
    { name: 'Home', preferences: { temp: 'F', wind: 'mph', notifications: false }, icon: '🏠' },
    { name: 'Travel', preferences: { temp: 'C', wind: 'km/h', notifications: true }, icon: '✈️' }
  ]);
  
  const [activeProfile, setActiveProfile] = useState(0);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <User className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>User Profiles</h3>
      </div>
      
      <div className="space-y-3">
        {profiles.map((profile, index) => (
          <button
            key={index}
            onClick={() => setActiveProfile(index)}
            className={`w-full p-4 rounded-xl transition-all ${
              activeProfile === index
                ? `bg-gradient-to-r ${theme.accent} text-white`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{profile.icon}</span>
                <div className="text-left">
                  <div className={`font-semibold ${activeProfile === index ? 'text-white' : theme.text}`}>
                    {profile.name}
                  </div>
                  <div className={`text-sm ${activeProfile === index ? 'text-white/70' : theme.text + ' opacity-70'}`}>
                    {profile.preferences.temp}° • {profile.preferences.wind}
                  </div>
                </div>
              </div>
              {activeProfile === index && (
                <span className="text-xl">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <button className={`w-full mt-4 py-2 border border-white/20 ${theme.text} rounded-xl hover:scale-105 transition-transform`}>
        <Settings size={16} className="inline mr-2" />
        Manage Profiles
      </button>
    </div>
  );
};

export default UserProfiles;
