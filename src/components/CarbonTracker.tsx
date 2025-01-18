import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, BarChart2, Wind, Trash2 } from 'lucide-react';

export const CarbonTracker = () => {
  const [carbonData, setCarbonData] = useState({
    transport: 0,
    energy: 0,
    waste: 0,
    total: 0,
    history: [] as { date: string; value: number }[]
  });

  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    // Simulate historical data
    const generateHistoricalData = () => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString(),
          value: Math.random() * 10 + 5
        };
      }).reverse();
      
      setCarbonData(prev => ({
        ...prev,
        history: last7Days
      }));
    };

    generateHistoricalData();
  }, []);

  const updateCarbonData = (category: keyof typeof carbonData, value: number) => {
    setCarbonData(prev => {
      const multipliers = {
        transport: 0.2,
        energy: 0.5,
        waste: 2.5
      };
      
      const newValue = value * (multipliers[category as keyof typeof multipliers] || 1);
      
      const newData = {
        ...prev,
        [category]: newValue
      };
      
      newData.total = newData.transport + newData.energy + newData.waste;
      return newData;
    });
  };

  const getEmissionLevel = (total: number) => {
    if (total < 5) return { text: 'Low Impact', color: 'text-green-500' };
    if (total < 10) return { text: 'Moderate Impact', color: 'text-yellow-500' };
    return { text: 'High Impact', color: 'text-red-500' };
  };

  const emissionStatus = getEmissionLevel(carbonData.total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-eco-primary">Carbon Footprint Tracker</h3>
        <div className="flex space-x-2">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTab === tab
                  ? 'bg-eco-primary text-white'
                  : 'bg-eco-background text-eco-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-4 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Transport</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary">
              {carbonData.transport.toFixed(1)} kg
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-4 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <BarChart2 className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Energy</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary">
              {carbonData.energy.toFixed(1)} kg
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-4 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Trash2 className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Waste</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary">
              {carbonData.waste.toFixed(1)} kg
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transportation (km/day)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
              value={carbonData.transport / 0.2}
              onChange={(e) => updateCarbonData('transport', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Usage (kWh/day)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
              value={carbonData.energy / 0.5}
              onChange={(e) => updateCarbonData('energy', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste (kg/day)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50"
              value={carbonData.waste / 2.5}
              onChange={(e) => updateCarbonData('waste', Number(e.target.value))}
            />
          </div>
        </div>

        <motion.div
          className="mt-6 p-4 bg-eco-background rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-eco-primary">
              Total Carbon Footprint:
            </p>
            <span className={`text-sm font-medium ${emissionStatus.color}`}>
              {emissionStatus.text}
            </span>
          </div>
          <p className="text-3xl font-bold text-eco-primary">
            {carbonData.total.toFixed(2)} kg CO₂
          </p>
          
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full rounded-full bg-eco-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((carbonData.total / 15) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Historical Trends</h4>
          <div className="h-40 relative">
            {carbonData.history.map((data, index) => (
              <motion.div
                key={data.date}
                className="absolute bottom-0"
                style={{
                  left: `${(index / (carbonData.history.length - 1)) * 100}%`,
                  height: `${(data.value / 15) * 100}%`,
                  width: '20px',
                  transform: 'translateX(-50%)'
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(data.value / 15) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="w-full bg-eco-secondary rounded-t-lg"
                  style={{ height: '100%' }}
                />
                <p className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                  {data.date}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};