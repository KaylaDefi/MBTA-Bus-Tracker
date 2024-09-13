export default async (req, res) => {
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  res.status(200).json({ key: GOOGLE_MAPS_API_KEY });
};
