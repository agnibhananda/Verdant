# Verdant - Personal EcoBuddy
## Login Details : 
Please Login using 
- Email: agnibhananda@gmail.com 
- Password: @Rudra42
## Problem Statement
Individuals struggle to understand and track their carbon footprint, making it harder to adopt sustainable habits.

## Solution
Verdant is a comprehensive web application that helps users track, understand, and reduce their carbon footprint through personalized challenges, real-time monitoring, and community engagement.

## Key Features

### 1. Carbon Footprint Dashboard
- Real-time carbon footprint tracking across transport, energy, and waste
- Interactive visualizations of emissions by category
- Personalized recommendations for reduction
- Progress tracking over time

### 2. Air Quality Monitoring
- Real-time air quality data for your location
- PM2.5 level tracking
- Air quality alerts and recommendations
- Historical air quality trends

### 3. Challenge System
- Gamified sustainability challenges
- Different difficulty levels (Easy, Medium, Hard)
- Point-based reward system
- Verification system for completed challenges
- Progress tracking and milestones

### 4. Community Features
- Discussion forum for sustainability topics
- Tips marketplace for sharing eco-friendly practices
- Community leaderboard
- Peer support and verification system

### 5. Personal Profile
- Achievement tracking
- Sustainability journey timeline
- Custom badges and rewards
- Progress statistics

## Technology Stack
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Supabase for backend
- Recharts & Plotly.js for data visualization
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/verdant.git
```

2. Install dependencies
```bash
cd verdant
npm install
```

3. Start the development server
```bash
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure
```
src/
├── components/         # React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Key Components

### CarbonTracker
- Tracks daily carbon emissions
- Provides breakdown by category
- Offers suggestions for reduction

### AirQualityMonitor
- Real-time air quality data
- Location-based monitoring
- Health recommendations

### Challenges
- Gamified sustainability tasks
- Progress tracking
- Reward system

### Community
- Forum discussions
- Tips marketplace
- User interactions

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- OpenAQ API for air quality data
- Supabase team for the backend infrastructure
- Community contributors

## Impact
Verdant helps users:
- Understand their carbon footprint
- Make informed environmental decisions
- Track progress towards sustainability goals
- Connect with like-minded individuals
- Develop lasting eco-friendly habits

## Future Enhancements
- Mobile app version
- Integration with smart home devices
- Machine learning for personalized recommendations
- Carbon offset marketplace
- Enhanced social features
