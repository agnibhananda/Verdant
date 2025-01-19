import React, { useState, useEffect } from 'react';
import { Wind, AlertTriangle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AirQualityData {
  location: string;
  city: string;
  parameter: string;
  value: number;
  unit: string;
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
        // Using the specific locations endpoint
        const locationIds = [8118, 8119, 8120, 8121, 8122]; // Example location IDs
        const dataPromises = locationIds.map(id => 
          fetch(`https://api.openaq.org/v3/locations/${id}`, {
            headers: {
              'X-API-Key': 'd80e4819a8c713b537e2a96d4941750098b25db2e7aa46e49616932ada8b627c'
            }
          }).then(res => res.json())
        );

        const responses = await Promise.all(dataPromises);
        
        const formattedData = responses
          .filter(data => data && data.results)
          .map(data => {
            const result = data.results;
            const pm25Data = result.parameters?.find(param => param.parameter === 'pm25');
            
            return {
              location: result.name || 'Unknown Location',
              city: result.city || 'Unknown City',
              parameter: 'pm25',
              value: pm25Data ? pm25Data.lastValue : 0,
              unit: pm25Data ? pm25Data.unit : 'µg/m³',
              lastUpdated: pm25Data ? new Date(pm25Data.lastUpdatedUTC).toLocaleString() : 'N/A'
            };
          })
          .filter(item => item.value > 0);

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

  const getAirQualityLevel = (value: number) => {
    if (value <= 12) return { text: 'Good', color: 'text-green-500' };
    if (value <= 35.4) return { text: 'Moderate', color: 'text-yellow-500' };
    if (value <= 55.4) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-500' };
    return { text: 'Unhealthy', color: 'text-red-500' };
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
                <span className={`text-sm font-medium ${getAirQualityLevel(data.value).color}`}>
                  {getAirQualityLevel(data.value).text}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">PM2.5</span>
                  <span className="font-semibold">{data.value} {data.unit}</span>
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