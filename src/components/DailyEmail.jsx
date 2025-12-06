import React, { useState } from 'react';
import { Mail, Clock } from 'lucide-react';

const DailyEmail = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('08:00');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="text-green-400" size={24} />
          <h3 className={`text-xl font-semibold ${theme.text}`}>Daily Weather Email</h3>
        </div>
        <div className="text-center py-4">
          <div className="text-5xl mb-3">✓</div>
          <div className={`text-lg font-semibold ${theme.text} mb-2`}>Subscribed!</div>
          <div className={`text-sm ${theme.text} opacity-70 mb-4`}>
            Daily forecast will be sent to {email} at {time}
          </div>
          <button 
            onClick={() => setSubscribed(false)}
            className={`px-4 py-2 ${theme.card} border border-white/20 ${theme.text} rounded-lg hover:scale-105 transition-transform`}
          >
            Unsubscribe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Mail className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Daily Weather Email</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className={`text-sm ${theme.text} opacity-70 mb-2 block`}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label className={`text-sm ${theme.text} opacity-70 mb-2 block`}>
            <Clock size={14} className="inline mr-1" />
            Delivery Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
          />
        </div>
        <button
          onClick={handleSubscribe}
          className={`w-full py-3 bg-gradient-to-r ${theme.accent} text-white rounded-xl font-semibold hover:scale-105 transition-transform`}
        >
          Subscribe to Daily Forecast
        </button>
      </div>
    </div>
  );
};

export default DailyEmail;
