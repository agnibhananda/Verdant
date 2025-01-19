import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, Wind, Trash2, Info, HelpCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PlotlyChart } from './PlotlyChart';

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
    total: 0
  });

  const [inputValues, setInputValues] = useState({
    transport: '',
    energy: '',
    waste: ''
  });

  const emissionsData = [{
    type: 'scatter',
    mode: 'lines+markers',
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    y: [23, 18, 15, 12, 10, 8],
    name: 'CO₂ Emissions',
    line: { 
      color: '#8CB369',
      width: 3,
      shape: 'spline'
    },
    marker: {
      color: '#2D5A27',
      size: 8
    },
    hovertemplate: '%{y} kg CO₂<br>%{x}<extra></extra>'
  }];

  const updateCarbonData = (category: keyof typeof carbonData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;

    setInputValues(prev => ({
      ...prev,
      [category]: value
    }));

    setCarbonData(prev => {
      const multipliers = {
        transport: 0.2, // kg CO₂ per km
        energy: 0.5,   // kg CO₂ per kWh
        waste: 2.5     // kg CO₂ per kg waste
      };
      
      const newValue = numValue * (multipliers[category as keyof typeof multipliers] || 1);
      
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

  const InputField = ({ 
    category, 
    icon: Icon, 
    label, 
    unit 
  }: { 
    category: keyof typeof inputValues; 
    icon: typeof Wind; 
    label: string; 
    unit: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-eco-background p-4 rounded-lg relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-eco-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <button
          onClick={() => setShowTooltip(showTooltip === category ? null : category)}
          className="text-eco-primary hover:text-eco-secondary transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
      {showTooltip === category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm -right-2 top-12 w-64"
        >
          {tooltips[category]}
        </motion.div>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          className="w-full bg-white rounded-md px-4 py-2.5 border border-gray-200 focus:border-eco-primary focus:ring-2 focus:ring-eco-accent focus:ring-opacity-50 transition-all duration-200 text-eco-primary font-medium"
          value={inputValues[category]}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              updateCarbonData(category, value);
            }
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          {unit}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        CO₂: {carbonData[category].toFixed(1)} kg
      </p>
    </motion.div>
  );

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
        <InputField
          category="transport"
          icon={Wind}
          label="Transport"
          unit="km"
        />
        <InputField
          category="energy"
          icon={LineChart}
          label="Energy"
          unit="kWh"
        />
        <InputField
          category="waste"
          icon={Trash2}
          label="Waste"
          unit="kg"
        />
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-eco-primary">Emission Trends</h4>
        </div>
        <PlotlyChart
          data={emissionsData}
          title=""
          layout={{
            height: 300,
            showlegend: false,
            xaxis: {
              showgrid: false,
              zeroline: false
            },
            yaxis: { 
              title: 'CO₂ (kg)',
              showgrid: true,
              gridcolor: 'rgba(0,0,0,0.1)',
              zeroline: false
            }
          }}
        />
      </div>
    </motion.div>
  );
};