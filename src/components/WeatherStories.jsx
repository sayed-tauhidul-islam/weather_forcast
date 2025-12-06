import React, { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

const WeatherStories = ({ theme }) => {
  const [stories] = useState([
    {
      title: 'The Great Storm of 1987',
      date: 'October 15-16, 1987',
      preview: 'A severe weather event that hit southern England...',
      icon: '🌪️'
    },
    {
      title: 'Heatwave Records',
      date: 'Summer 2022',
      preview: 'Record-breaking temperatures across Europe...',
      icon: '🔥'
    },
    {
      title: 'Winter Wonderland',
      date: 'December 2010',
      preview: 'The coldest December in over 100 years...',
      icon: '❄️'
    },
    {
      title: 'Perfect Weather Day',
      date: 'June 21, 2023',
      preview: 'When all conditions aligned perfectly...',
      icon: '☀️'
    }
  ]);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Weather Stories</h3>
      </div>
      
      <div className="space-y-3">
        {stories.map((story, index) => (
          <div 
            key={index}
            className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="text-3xl">{story.icon}</span>
                <div>
                  <div className={`font-semibold ${theme.text} mb-1`}>{story.title}</div>
                  <div className={`text-sm ${theme.text} opacity-70 mb-2`}>{story.date}</div>
                  <div className={`text-sm ${theme.text} opacity-60`}>{story.preview}</div>
                </div>
              </div>
              <ChevronRight className={`${theme.text} opacity-50 group-hover:opacity-100 transition-opacity`} size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherStories;
