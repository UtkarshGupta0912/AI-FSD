const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/doctors?lat=&lng=&specialty= — find nearby doctors
router.get('/', auth, async (req, res) => {
  try {
    const { lat, lng, specialty = 'doctor' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location (lat, lng) is required' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      // Return demo data when API key is not configured
      return res.json(getDemoDoctors(parseFloat(lat), parseFloat(lng)));
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000, // 5km radius
        type: 'doctor',
        keyword: specialty,
        key: apiKey
      }
    });

    const doctors = response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      totalRatings: place.user_ratings_total || 0,
      specialization: specialty,
      location: place.geometry.location,
      isOpen: place.opening_hours?.open_now || false,
      distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
    }));

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1) + ' km';
}

function getDemoDoctors(lat, lng) {
  return [
    { id: '1', name: 'Dr. Priya Sharma', address: 'Apollo Hospital, Sector 15', rating: 4.8, totalRatings: 342, specialization: 'General Physician', distance: '1.2 km', isOpen: true },
    { id: '2', name: 'Dr. Rajesh Gupta', address: 'Max Healthcare, Civil Lines', rating: 4.6, totalRatings: 218, specialization: 'Cardiologist', distance: '2.5 km', isOpen: true },
    { id: '3', name: 'Dr. Anita Verma', address: 'Fortis Hospital, Sector 62', rating: 4.7, totalRatings: 156, specialization: 'Endocrinologist', distance: '3.1 km', isOpen: false },
    { id: '4', name: 'Dr. Sunil Mehta', address: 'Medanta Hospital, Golf Course Road', rating: 4.9, totalRatings: 489, specialization: 'General Physician', distance: '4.0 km', isOpen: true },
    { id: '5', name: 'Dr. Kavita Singh', address: 'AIIMS Extension Clinic', rating: 4.5, totalRatings: 127, specialization: 'Pathologist', distance: '4.8 km', isOpen: true }
  ];
}

module.exports = router;
