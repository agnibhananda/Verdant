import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Car,
  Zap,
  RecycleIcon,
  Info,
  Bike,
  Bus,
  Train,
  Battery,
  Apple
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PlotlyChart } from './PlotlyChart';

export const CarbonTracker = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeSection, setActiveSection] = useState<'transport' | 'energy' | 'waste'>('transport');
  const [showTip, setShowTip] = useState(false);

  const [data, setData] = useState({
    transport: {
      mode: 'car',
      frequency: 'daily',
      distance: 'medium'
    },
    energy: {
      usage: 'medium',
      renewable: false
    },
    waste: {
      recycling: true,
      composting: false
    }
  });

  const [impact, setImpact] = useState({
    transport: 0,
    energy: 0,
    waste: 0,
    total: 0
  });

  const transportModes = [
    { id: 'car', label: 'Car', icon: Car, impact: 'high' },
    { id: 'bus', label: 'Bus', icon: Bus, impact: 'medium' },
    { id: 'train', label: 'Train', icon: Train, impact: 'low' },
    { id: 'bike', label: 'Bicycle', icon: Bike, impact: 'none' }
  ];

  const usageLevels = [
    { id: 'low', label: 'Low', description: '1-3 hrs/day' },
    { id: 'medium', label: 'Medium', description: '4-6 hrs/day' },
    { id: 'high', label: 'High', description: '7+ hrs/day' }
  ];

  const calculateImpact = () => {
    const transportImpact = {
      car: 10,
      bus: 5,
      train: 3,
      bike: 0
    }[data.transport.mode] * {
      low: 0.5,
      medium: 1,
      high: 1.5
    }[data.transport.distance];

    const energyImpact = {
      low: 3,
      medium: 6,
      high: 9
    }[data.energy.usage] * (data.energy.renewable ? 0.5 : 1);

    const wasteImpact = 5 * (data.waste.recycling ? 0.6 : 1) * (data.waste.composting ? 0.8 : 1);

    setImpact({
      transport: transportImpact,
      energy: energyImpact,
      waste: wasteImpact,
      total: transportImpact + energyImpact + wasteImpact
    });
  };

  useEffect(() => {
    calculateImpact();
  }, [data]);

  const getImpactColor = (value: number) => {
    if (value < 10) return 'text-green-500';
    if (value < 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderTransportSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {transportModes.map(mode => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setData({
              ...data,
              transport: { ...data.transport, mode: mode.id }
            })}
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              data.transport.mode === mode.id
                ? 'bg-eco-accent/20 border-2 border-eco-primary'
                : 'bg-white border-2 border-transparent hover:border-eco-accent'
            }`}
          >
            <mode.icon className="h-6 w-6 sm:h-8 sm:w-8 text-eco-primary" />
            <span className="text-xs sm:text-sm font-medium">{mode.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Distance</label>
        <div className="grid grid-cols-3 gap-3">
          {['low', 'medium', 'high'].map(level => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({
                ...data,
                transport: { ...data.transport, distance: level }
              })}
              className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${
                data.transport.distance === level
                  ? 'bg-eco-accent/20 border-2 border-eco-primary'
                  : 'bg-white border-2 border-transparent hover:border-eco-accent'
              }`}
            >
              <span className="capitalize text-sm sm:text-base">{level}</span>
              <br />
              <span className="text-xs text-gray-500">
                {level === 'low' ? '< 5km' : level === 'medium' ? '5-20km' : '> 20km'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnergySection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Daily Usage</label>
        <div className="space-y-2">
          {usageLevels.map(level => (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setData({
                ...data,
                energy: { ...data.energy, usage: level.id }
              })}
              className={`w-full p-3 sm:p-4 rounded-lg flex justify-between items-center transition-colors ${
                data.energy.usage === level.id
                  ? 'bg-eco-accent/20 border-2 border-eco-primary'
                  : 'bg-white border-2 border-transparent hover:border-eco-accent'
              }`}
            >
              <span className="font-medium capitalize text-sm sm:text-base">{level.label}</span>
              <span className="text-xs sm:text-sm text-gray-500">{level.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setData({
          ...data,
          energy: { ...data.energy, renewable: !data.energy.renewable }
        })}
        className={`w-full p-3 sm:p-4 rounded-lg flex items-center justify-between transition-colors ${
          data.energy.renewable
            ? 'bg-eco-accent/20 border-2 border-eco-primary'
            : 'bg-white border-2 border-transparent hover:border-eco-accent'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Battery className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Using Renewable Energy</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">-50% impact</div>
      </motion.button>
    </div>
  );

  const renderWasteSection = () => (
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setData({
          ...data,
          waste: { ...data.waste, recycling: !data.waste.recycling }
        })}
        className={`w-full p-3 sm:p-4 rounded-lg flex items-center justify-between transition-colors ${
          data.waste.recycling
            ? 'bg-eco-accent/20 border-2 border-eco-primary'
            : 'bg-white border-2 border-transparent hover:border-eco-accent'
        }`}
      >
        <div className="flex items-center space-x-2">
          <RecycleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Regular Recycling</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">-40% impact</div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setData({
          ...data,
          waste: { ...data.waste, composting: !data.waste.composting }
        })}
        className={`w-full p-3 sm:p-4 rounded-lg flex items-center justify-between transition-colors ${
          data.waste.composting
            ? 'bg-eco-accent/20 border-2 border-eco-primary'
            : 'bg-white border-2 border-transparent hover:border-eco-accent'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Apple className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Food Waste Composting</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">-20% impact</div>
      </motion.button>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-eco-primary">Carbon Footprint</h3>
        <button
          onClick={() => setShowTip(!showTip)}
          className="text-eco-primary hover:text-eco-secondary"
        >
          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {showTip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-eco-background rounded-lg text-xs sm:text-sm text-gray-600"
        >
          Track your environmental impact by selecting your daily habits.
          The calculator will estimate your carbon footprint and suggest improvements.
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {(['transport', 'energy', 'waste'] as const).map(section => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(section)}
            className={`p-2 sm:p-4 rounded-lg transition-colors text-sm sm:text-base ${
              activeSection === section
                ? 'bg-eco-primary text-white'
                : 'bg-eco-background hover:bg-eco-accent/20'
            }`}
          >
            <span className="capitalize">{section}</span>
          </motion.button>
        ))}
      </div>

      <div className="mb-6 sm:mb-8">
        {activeSection === 'transport' && renderTransportSection()}
        {activeSection === 'energy' && renderEnergySection()}
        {activeSection === 'waste' && renderWasteSection()}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-3 sm:p-4 rounded-lg"
          >
            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-eco-primary mb-2" />
            <div className={`text-lg sm:text-xl font-bold ${getImpactColor(impact.transport)}`}>
              {impact.transport.toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Transport</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-3 sm:p-4 rounded-lg"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-eco-primary mb-2" />
            <div className={`text-lg sm:text-xl font-bold ${getImpactColor(impact.energy)}`}>
              {impact.energy.toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Energy</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background p-3 sm:p-4 rounded-lg"
          >
            <RecycleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-eco-primary mb-2" />
            <div className={`text-lg sm:text-xl font-bold ${getImpactColor(impact.waste)}`}>
              {impact.waste.toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Waste</div>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-eco-background p-3 sm:p-4 rounded-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Total Impact</span>
            <span className={`text-sm sm:text-base font-bold ${getImpactColor(impact.total)}`}>
              {impact.total.toFixed(1)} kg CO₂/day
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-eco-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((impact.total / 30) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};