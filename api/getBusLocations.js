const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const MBTA_API_KEY = process.env.MBTA_API_KEY;
    
    console.log("MBTA API Key:", MBTA_API_KEY);
    
    if (!MBTA_API_KEY) {
        console.error("MBTA API Key is missing in the environment variables.");
        return res.status(500).json({ error: "MBTA API Key is missing." });
    }

    const url = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}&filter[route]=1&include=trip`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch MBTA data. Status: ${response.status}`);
            return res.status(response.status).json({ error: "Failed to fetch MBTA bus locations" });
        }

        const data = await response.json();
        console.log("MBTA Bus Data Fetched Successfully:", data);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error occurred while fetching MBTA data:", error.message);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
