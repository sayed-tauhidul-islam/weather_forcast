export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }

    const data = await response.json();
    res.status(200).json({ success: true, data: data.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
