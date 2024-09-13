const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const MBTA_API_KEY = process.env.MBTA_API_KEY;
    
    if (!MBTA_API_KEY) {
        return res.status(500).json({ error: "MBTA API key is missing" });
    }

    const url = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}&filter[route]=1&include=trip`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch bus locations" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
