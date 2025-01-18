import { motion } from 'framer-motion';
import { useState } from 'react';

export const CarbonTracker = () => {
  const [carbonData, setCarbonData] = useState({
    transport: 0,
    energy: 0,
    waste: 0,
    total: 0
  });

  const updateCarbonData = (category: keyof typeof carbonData, value: number) => {
    setCarbonData(prev => {
      const newData = {
        ...prev,
        [category]: value
      };
      newData.total = newData.transport + newData.energy + newData.waste;
      return newData;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h3 className="text-xl font-bold text-eco-primary mb-4">Carbon Footprint Tracker</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transportation (km/day)
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
            value={carbonData.transport}
            onChange={(e) => updateCarbonData('transport', Number(e.target.value) * 0.2)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Energy Usage (kWh/day)
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
            value={carbonData.energy}
            onChange={(e) => updateCarbonData('energy', Number(e.target.value) * 0.5)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waste (kg/day)
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
            value={carbonData.waste}
            onChange={(e) => updateCarbonData('waste', Number(e.target.value) * 2.5)}
          />
        </div>

        <motion.div
          className="mt-6 p-4 bg-eco-background rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-lg font-semibold text-eco-primary">
            Estimated Daily Carbon Footprint:
          </p>
          <p className="text-3xl font-bold text-eco-secondary">
            {carbonData.total.toFixed(2)} kg CO₂
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};