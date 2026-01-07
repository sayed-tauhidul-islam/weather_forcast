export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
