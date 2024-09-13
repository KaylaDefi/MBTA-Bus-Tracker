import fetch from 'node-fetch';

export default async (req, res) => {
  const MBTA_API_KEY = process.env.MBTA_API_KEY;
  const url = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}&filter[route]=1&include=trip`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bus locations" });
  }
};
