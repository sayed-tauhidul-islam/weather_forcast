export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
