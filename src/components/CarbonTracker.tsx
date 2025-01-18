import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, Wind, Trash2, Info, HelpCircle } from 'lucide-react';
import { Chart } from './DataVisualization';
import { useInView } from 'react-intersection-observer';

export const CarbonTracker = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
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
          value: Math.random() * 10 + 5,
          transport: Math.random() * 4 + 2,
          energy: Math.random() * 3 + 1,
          waste: Math.random() * 3 + 2
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
        transport: 0.2, // kg CO₂ per km
        energy: 0.5,   // kg CO₂ per kWh
        waste: 2.5     // kg CO₂ per kg waste
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
    if (total < 5) return { text: 'Low Impact', color: 'text-green-500', description: 'Great job! Your carbon footprint is below average.' };
    if (total < 10) return { text: 'Moderate Impact', color: 'text-yellow-500', description: 'You\'re doing okay, but there\'s room for improvement.' };
    return { text: 'High Impact', color: 'text-red-500', description: 'Consider taking steps to reduce your carbon footprint.' };
  };

  const tooltips = {
    transport: "Transportation emissions come from vehicles. Walking, cycling, or using public transport can help reduce this!",
    energy: "Energy emissions come from electricity usage. Try using energy-efficient appliances and turning off unused devices.",
    waste: "Waste emissions come from garbage decomposition. Recycling and composting can help reduce this!"
  };

  const emissionStatus = getEmissionLevel(carbonData.total);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-eco-primary">Carbon Footprint Tracker</h3>
          <p className="text-sm text-gray-600 mt-1">Track and understand your environmental impact</p>
        </div>
        <button
          onClick={() => setShowTooltip(showTooltip ? null : 'main')}
          className="text-eco-primary hover:text-eco-secondary transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      {showTooltip === 'main' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-eco-background p-4 rounded-lg mb-4"
        >
          <h4 className="font-semibold text-eco-primary mb-2">Understanding Your Carbon Footprint</h4>
          <p className="text-sm text-gray-600">
            Your carbon footprint is the total amount of greenhouse gases produced by your daily activities.
            Track your transportation, energy use, and waste to see your environmental impact.
          </p>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-eco-background p-4 rounded-lg relative"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Transport</span>
            </div>
            <button
              onClick={() => setShowTooltip(showTooltip === 'transport' ? null : 'transport')}
              className="text-eco-primary hover:text-eco-secondary"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          {showTooltip === 'transport' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm -right-2 top-12 w-64"
            >
              {tooltips.transport}
            </motion.div>
          )}
          <div>
            <input
              type="number"
              className="w-full bg-white rounded-md border-gray-300 focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50 mb-2"
              value={carbonData.transport / 0.2}
              onChange={(e) => updateCarbonData('transport', Number(e.target.value))}
              placeholder="Enter km traveled"
            />
            <p className="text-xs text-gray-500">CO₂: {carbonData.transport.toFixed(1)} kg</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-eco-background p-4 rounded-lg relative"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Energy</span>
            </div>
            <button
              onClick={() => setShowTooltip(showTooltip === 'energy' ? null : 'energy')}
              className="text-eco-primary hover:text-eco-secondary"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          {showTooltip === 'energy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm -right-2 top-12 w-64"
            >
              {tooltips.energy}
            </motion.div>
          )}
          <div>
            <input
              type="number"
              className="w-full bg-white rounded-md border-gray-300 focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50 mb-2"
              value={carbonData.energy / 0.5}
              onChange={(e) => updateCarbonData('energy', Number(e.target.value))}
              placeholder="Enter kWh used"
            />
            <p className="text-xs text-gray-500">CO₂: {carbonData.energy.toFixed(1)} kg</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-eco-background p-4 rounded-lg relative"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-eco-primary" />
              <span className="text-sm font-medium">Waste</span>
            </div>
            <button
              onClick={() => setShowTooltip(showTooltip === 'waste' ? null : 'waste')}
              className="text-eco-primary hover:text-eco-secondary"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          {showTooltip === 'waste' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm -right-2 top-12 w-64"
            >
              {tooltips.waste}
            </motion.div>
          )}
          <div>
            <input
              type="number"
              className="w-full bg-white rounded-md border-gray-300 focus:border-eco-primary focus:ring focus:ring-eco-accent focus:ring-opacity-50 mb-2"
              value={carbonData.waste / 2.5}
              onChange={(e) => updateCarbonData('waste', Number(e.target.value))}
              placeholder="Enter kg of waste"
            />
            <p className="text-xs text-gray-500">CO₂: {carbonData.waste.toFixed(1)} kg</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-eco-background p-6 rounded-lg mb-6"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-lg font-semibold text-eco-primary">
              Total Carbon Footprint
            </h4>
            <p className="text-sm text-gray-600">
              Your estimated daily carbon dioxide emissions
            </p>
          </div>
          <span className={`text-sm font-medium ${emissionStatus.color}`}>
            {emissionStatus.text}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-eco-primary">
              {carbonData.total.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600 mb-1">kg CO₂</span>
          </div>
          
          <div className="relative pt-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full rounded-full bg-eco-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((carbonData.total / 15) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            {emissionStatus.description}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-eco-primary">Emission Trends</h4>
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

        <Chart
          data={carbonData.history}
          type="line"
          dataKey="value"
          xAxisKey="date"
          title="Carbon Emissions Over Time"
        />
      </div>
    </motion.div>
  );
};