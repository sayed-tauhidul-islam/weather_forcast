// Animated weather particles component
export function WeatherParticles({ weatherCode, isDay }) {
  const getParticleType = () => {
    if (weatherCode >= 61 && weatherCode <= 65) return 'rain';
    if (weatherCode >= 71 && weatherCode <= 75) return 'snow';
    if (weatherCode >= 95) return 'storm';
    if (weatherCode === 0 && isDay) return 'sun';
    return null;
  };

  const particleType = getParticleType();
  
  if (!particleType) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particleType === 'rain' && (
        <div className="rain-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {particleType === 'snow' && (
        <div className="snow-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      )}

      {particleType === 'storm' && (
        <div className="storm-container">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="lightning"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {particleType === 'sun' && (
        <div className="sun-rays">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="ray"
              style={{
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-64 gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-blue-400/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-300 animate-spin animation-delay-150"></div>
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-sky-200 animate-spin animation-delay-300"></div>
      </div>
      <p className="text-blue-200 animate-pulse">Fetching weather data...</p>
    </div>
  );
}
