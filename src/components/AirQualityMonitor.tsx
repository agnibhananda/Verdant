import React, { useState, useEffect } from 'react';
import { Wind, AlertTriangle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AirQualityData {
  location: string;
  city: string;
  aqi: number;
  dominantPollutant: string;
  lastUpdated: string;
}

export const AirQualityMonitor = () => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        // Using major cities as examples
        const cities = ['delhi' ];
        const dataPromises = cities.map(city => 
          fetch(`https://api.waqi.info/feed/${city}/?token=2ddf41378f91f1474516928a64a3650ed2e2fc85`)
            .then(res => res.json())
        );

        const responses = await Promise.all(dataPromises);
        
        const formattedData = responses
          .filter(response => response.status === 'ok')
          .map(response => {
            const data = response.data;
            return {
              location: data.city.name,
              city: "New Delhi",
              aqi: data.aqi,
              dominantPollutant: data.dominentpol || 'Unknown',
              lastUpdated: new Date(data.time.iso).toLocaleString()
            };
          });

        if (formattedData.length === 0) {
          throw new Error('No air quality data available');
        }

        setAirQualityData(formattedData);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Unable to fetch air quality data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, []);

  const getAirQualityLevel = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good', color: 'text-green-500' };
    if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-500' };
    if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-500' };
    if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-500' };
    if (aqi <= 300) return { text: 'Very Unhealthy', color: 'text-purple-500' };
    return { text: 'Hazardous', color: 'text-rose-700' };
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wind className="h-6 w-6 text-eco-primary" />
          <h3 className="text-xl font-bold text-eco-primary">Air Quality Monitor</h3>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading air quality data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && airQualityData.length > 0 && (
        <div className="space-y-4">
          {airQualityData.map((data, index) => (
            <motion.div
              key={`${data.location}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-eco-background p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-eco-primary" />
                    <h4 className="font-semibold text-eco-primary">{data.location}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{data.city}</p>
                </div>
                <span className={`text-sm font-medium ${getAirQualityLevel(data.aqi).color}`}>
                  {getAirQualityLevel(data.aqi).text}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Air Quality Index</span>
                  <span className="font-semibold">{data.aqi}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Main Pollutant</span>
                  <span className="font-semibold">{data.dominantPollutant}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last updated: {data.lastUpdated}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};