import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Wind, 
  Trash2, 
  Info, 
  HelpCircle, 
  Car, 
  Plane, 
  Train, 
  Bike, 
  Battery, 
  Lightbulb,
  RecycleIcon,
  Calendar,
  Bus,
  Zap,
  Apple,
  Newspaper,
  ShoppingBag,
  Trophy,
  MapPin
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PlotlyChart } from './PlotlyChart';

type TimeFrame = 'daily' | 'monthly';
type TransportMode = 'car' | 'bus' | 'bike' | 'walking' | 'train' | 'flight';
type CommuteDistance = '<5' | '5-20' | '20-50' | '50+';
type EnergyType = 'electricity' | 'gas' | 'solar' | 'mixed';
type WasteFrequency = 'daily' | 'weekly';
type ApplianceUsage = 'low' | 'medium' | 'high';

interface TransportData {
  mode: TransportMode;
  commuteType: string;
  distance: CommuteDistance;
  frequency: string;
}

interface EnergyData {
  type: EnergyType;
  acUsage: ApplianceUsage;
  applianceUsage: ApplianceUsage;
}

interface WasteData {
  frequency: WasteFrequency;
  composting: boolean;
  recycling: {
    plastic: boolean;
    paper: boolean;
    glass: boolean;
  };
  bagCount: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export const CarbonTracker = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const [transportData, setTransportData] = useState<TransportData>({
    mode: 'car',
    commuteType: 'work',
    distance: '5-20',
    frequency: 'daily'
  });

  const [energyData, setEnergyData] = useState<EnergyData>({
    type: 'electricity',
    acUsage: 'medium',
    applianceUsage: 'medium'
  });

  const [wasteData, setWasteData] = useState<WasteData>({
    frequency: 'weekly',
    composting: false,
    recycling: {
      plastic: false,
      paper: false,
      glass: false
    },
    bagCount: '1'
  });

  const [carbonData, setCarbonData] = useState({
    transport: 0,
    energy: 0,
    waste: 0,
    total: 0,
    cityAverage: 150, // Example city average
    savings: 0
  });

  const wizardSteps: WizardStep[] = [
    {
      id: 'transport',
      title: 'Transportation',
      description: 'Let\'s understand your travel habits',
      icon: Car
    },
    {
      id: 'energy',
      title: 'Energy Usage',
      description: 'Tell us about your energy consumption',
      icon: Zap
    },
    {
      id: 'waste',
      title: 'Waste Management',
      description: 'How do you handle waste?',
      icon: RecycleIcon
    }
  ];

  const commuteTypes = [
    { value: 'work', label: 'Work Commute', example: '~10 km one-way' },
    { value: 'school', label: 'School Run', example: '~5 km one-way' },
    { value: 'shopping', label: 'Shopping Trips', example: '~3 km round trip' },
    { value: 'leisure', label: 'Leisure Activities', example: 'Variable distance' }
  ];

  const distanceRanges = [
    { value: '<5', label: 'Less than 5 km', co2: 1 },
    { value: '5-20', label: '5 to 20 km', co2: 2.5 },
    { value: '20-50', label: '20 to 50 km', co2: 6 },
    { value: '50+', label: 'More than 50 km', co2: 10 }
  ];

  const transportModes = [
    { value: 'car', label: 'Car', icon: Car, co2Factor: 1 },
    { value: 'bus', label: 'Bus', icon: Bus, co2Factor: 0.5 },
    { value: 'bike', label: 'Bicycle', icon: Bike, co2Factor: 0 },
    { value: 'walking', label: 'Walking', icon: Wind, co2Factor: 0 },
    { value: 'train', label: 'Train', icon: Train, co2Factor: 0.3 }
  ];

  const energyTypes = [
    { value: 'electricity', label: 'Electricity', icon: Zap },
    { value: 'gas', label: 'Natural Gas', icon: Wind },
    { value: 'solar', label: 'Solar Power', icon: Battery },
    { value: 'mixed', label: 'Mixed Sources', icon: Lightbulb }
  ];

  const applianceUsageLevels = [
    { value: 'low', label: '1-3 hours daily', co2: 2 },
    { value: 'medium', label: '4-6 hours daily', co2: 5 },
    { value: 'high', label: '7+ hours daily', co2: 8 }
  ];

  const wasteCategories = [
    { id: 'plastic', icon: ShoppingBag, label: 'Plastic' },
    { id: 'paper', icon: Newspaper, label: 'Paper' },
    { id: 'glass', icon: Info, label: 'Glass' }
  ];

  const calculateCarbonFootprint = () => {
    // Transport calculations
    const distanceRange = distanceRanges.find(d => d.value === transportData.distance);
    const transportMode = transportModes.find(m => m.value === transportData.mode);
    const transportEmission = (distanceRange?.co2 || 0) * (transportMode?.co2Factor || 0);

    // Energy calculations
    const acEmission = applianceUsageLevels.find(l => l.value === energyData.acUsage)?.co2 || 0;
    const applianceEmission = applianceUsageLevels.find(l => l.value === energyData.applianceUsage)?.co2 || 0;
    const energyEmission = acEmission + applianceEmission;
    
    // Waste calculations
    const baseWasteEmission = parseInt(wasteData.bagCount) * 5; // 5kg CO2 per bag
    const recyclingReduction = Object.values(wasteData.recycling).filter(Boolean).length * 0.2;
    const wasteEmission = baseWasteEmission * (1 - recyclingReduction) * (wasteData.composting ? 0.8 : 1);

    // Calculate total and savings
    const total = transportEmission + energyEmission + wasteEmission;
    const savings = carbonData.cityAverage - total;

    // Monthly adjustment
    const multiplier = timeFrame === 'monthly' ? 30 : 1;
    
    setCarbonData({
      transport: transportEmission * multiplier,
      energy: energyEmission * multiplier,
      waste: wasteEmission * multiplier,
      total: total * multiplier,
      cityAverage: carbonData.cityAverage * multiplier,
      savings: savings * multiplier
    });
  };

  useEffect(() => {
    calculateCarbonFootprint();
  }, [transportData, energyData, wasteData, timeFrame]);

  const renderTransportStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          How do you commute?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {transportModes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.value}
                onClick={() => setTransportData({ ...transportData, mode: mode.value as TransportMode })}
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  transportData.mode === mode.value 
                    ? 'border-eco-primary bg-eco-accent/20' 
                    : 'border-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Type of journey
        </label>
        <select
          value={transportData.commuteType}
          onChange={(e) => setTransportData({ ...transportData, commuteType: e.target.value })}
          className="w-full bg-white rounded-lg border-gray-200 p-3"
        >
          {commuteTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label} ({type.example})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          How far do you travel?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {distanceRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTransportData({ ...transportData, distance: range.value as CommuteDistance })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                transportData.distance === range.value 
                  ? 'border-eco-primary bg-eco-accent/20' 
                  : 'border-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnergyStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          What type of energy do you use most?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {energyTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setEnergyData({ ...energyData, type: type.value as EnergyType })}
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  energyData.type === type.value 
                    ? 'border-eco-primary bg-eco-accent/20' 
                    : 'border-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Air Conditioning Usage
        </label>
        <div className="space-y-2">
          {applianceUsageLevels.map(level => (
            <button
              key={level.value}
              onClick={() => setEnergyData({ ...energyData, acUsage: level.value as ApplianceUsage })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                energyData.acUsage === level.value 
                  ? 'border-eco-primary bg-eco-accent/20' 
                  : 'border-gray-200'
              }`}
            >
              <span>{level.label}</span>
              <span className="text-sm text-gray-500">
                ~{level.co2} kg CO₂/day
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Other Appliances Usage
        </label>
        <div className="space-y-2">
          {applianceUsageLevels.map(level => (
            <button
              key={level.value}
              onClick={() => setEnergyData({ ...energyData, applianceUsage: level.value as ApplianceUsage })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                energyData.applianceUsage === level.value 
                  ? 'border-eco-primary bg-eco-accent/20' 
                  : 'border-gray-200'
              }`}
            >
              <span>{level.label}</span>
              <span className="text-sm text-gray-500">
                ~{level.co2} kg CO₂/day
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWasteStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          How often do you take out the trash?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setWasteData({ ...wasteData, frequency: 'daily' })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              wasteData.frequency === 'daily' 
                ? 'border-eco-primary bg-eco-accent/20' 
                : 'border-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setWasteData({ ...wasteData, frequency: 'weekly' })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              wasteData.frequency === 'weekly' 
                ? 'border-eco-primary bg-eco-accent/20' 
                : 'border-gray-200'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          What do you recycle?
        </label>
        <div className="grid grid-cols-3 gap-4">
          {wasteCategories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setWasteData({
                  ...wasteData,
                  recycling: {
                    ...wasteData.recycling,
                    [category.id]: !wasteData.recycling[category.id as keyof typeof wasteData.recycling]
                  }
                })}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  wasteData.recycling[category.id as keyof typeof wasteData.recycling]
                    ? 'border-eco-primary bg-eco-accent/20' 
                    : 'border-gray-200'
                }`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Do you compost food waste?
        </label>
        <button
          onClick={() => setWasteData({ ...wasteData, composting: !wasteData.composting })}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
            wasteData.composting 
              ? 'border-eco-primary bg-eco-accent/20' 
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Apple className="h-5 w-5" />
            <span>Food Waste Composting</span>
          </div>
          <span className="text-sm text-gray-500">
            Reduces CO₂ by 20%
          </span>
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Approximate number of trash bags
        </label>
        <select
          value={wasteData.bagCount}
          onChange={(e) => setWasteData({ ...wasteData, bagCount: e.target.value })}
          className="w-full bg-white rounded-lg border-gray-200 p-3"
        >
          <option value="1">1 bag (~5 kg waste)</option>
          <option value="2">2 bags (~10 kg waste)</option>
          <option value="3">3 bags (~15 kg waste)</option>
          <option value="4">4+ bags (20+ kg waste)</option>
        </select>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderTransportStep();
      case 1:
        return renderEnergyStep();
      case 2:
        return renderWasteStep();
      default:
        return null;
    }
  };

  const renderSummary = () => (
    <motion.div
      className="bg-eco-background p-6 rounded-lg"
      whileHover={{ scale: 1.01 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-eco-primary">
            Your Carbon Footprint
          </h4>
          <div className="flex items-center space-x-2">
            {carbonData.savings > 0 ? (
              <Trophy className="h-5 w-5 text-green-500" />
            ) : (
              <Info className="h-5 w-5 text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${
              carbonData.savings > 0 ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {carbonData.savings > 0 
                ? `${((carbonData.savings / carbonData.cityAverage) * 100).toFixed(0)}% below average`
                : 'Above average'
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <Car className="h-5 w-5 text-eco-primary mb-2" />
            <div className="text-2xl font-bold text-eco-primary">
              {carbonData.transport.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">kg CO₂ from transport</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Zap className="h-5 w-5 text-eco-primary mb-2" />
            <div className="text-2xl font-bold text-eco-primary">
              {carbonData.energy.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">kg CO₂ from energy</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <RecycleIcon className="h-5 w-5 text-eco-primary mb-2" />
            <div className="text-2xl font-bold text-eco-primary">
              {carbonData.waste.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">kg CO₂ from waste</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Emissions</span>
            <span className="text-sm text-gray-600">City Average</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-eco-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(carbonData.total / carbonData.cityAverage) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-eco-primary">
              {carbonData.total.toFixed(1)} kg
            </span>
            <span className="text-sm text-gray-600">
              {carbonData.cityAverage.toFixed(1)} kg
            </span>
          </div>
        </div>

        <div className="bg-eco-accent bg-opacity-20 p-4 rounded-lg">
          <h5 className="font-semibold text-eco-primary mb-2">
            Personalized Recommendations
          </h5>
          <ul className="space-y-2 text-sm text-gray-600">
            {transportData.mode === 'car' && (
              <li className="flex items-center space-x-2">
                <Bike className="h-4 w-4 text-eco-primary" />
                <span>Switch to cycling for trips under 5km to save 2.5kg CO₂ per trip</span>
              </li>
            )}
            {energyData.acUsage === 'high' && (
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-eco-primary" />
                <span>Reduce AC usage by 2 hours to save 1kg CO₂ per day</span>
              </li>
            )}
            {!wasteData.composting && (
              <li className="flex items-center space-x-2">
                <Apple className="h-4 w-4 text-eco-primary" />
                <span>Start composting to reduce waste emissions by 20%</span>
              </li>
            )}
          </ul>
        </div>
      </div>
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
          <h3 className="text-xl font-bold text-eco-primary">Carbon Footprint Calculator</h3>
          <p className="text-sm text-gray-600 mt-1">Track and reduce your environmental impact</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-eco-background rounded-lg p-2">
            <button
              onClick={() => setTimeFrame('daily')}
              className={`px-3 py-1 rounded-md ${
                timeFrame === 'daily' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeFrame('monthly')}
              className={`px-3 py-1 rounded-md ${
                timeFrame === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {wizardSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center space-y-2 ${
                  currentStep === index ? 'text-eco-primary' : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === index ? 'bg-eco-accent' : 'bg-gray-100'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            );
          })}
        </div>

        {renderCurrentStep()}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className={`px-4 py-2 rounded-lg ${
              currentStep === 0 
                ? 'invisible' 
                : 'bg-eco-background text-eco-primary hover:bg-eco-accent/20'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(prev => prev < wizardSteps.length - 1 ? prev + 1 : prev)}
            className={`px-4 py-2 rounded-lg ${
              currentStep === wizardSteps.length - 1
                ? 'invisible'
                : 'bg-eco-primary text-white hover:bg-eco-secondary'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {renderSummary()}
    </motion.div>
  );
};