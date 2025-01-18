export function initChallenges() {
  const challenges = document.getElementById('challenges');
  
  const challengesList = [
    {
      icon: 'droplet',
      title: 'Water Conservation Week',
      description: 'Reduce your daily water consumption by implementing smart water-saving techniques.',
      category: 'sustainable',
      points: 500,
      difficulty: 'Medium',
      participants: 1234,
    },
    {
      icon: 'zap',
      title: 'Energy-Free Evening',
      description: 'Spend one evening per week without using electricity (except essentials).',
      category: 'energy',
      points: 300,
      difficulty: 'Easy',
      participants: 2156,
    },
    {
      icon: 'recycle',
      title: 'Zero Waste Challenge',
      description: 'Produce zero non-recyclable waste for an entire week.',
      category: 'waste',
      points: 750,
      difficulty: 'Hard',
      participants: 892,
    },
  ];

  challenges.innerHTML = `
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold text-eco-primary">Monthly Challenges</h2>
        <div class="flex items-center space-x-2 text-eco-primary">
          <i data-lucide="calendar" class="h-5 w-5"></i>
          <span>March 2024</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${challengesList.map(challenge => `
          <div class="challenge-card">
            <div class="challenge-card-header">
              <div class="flex items-center space-x-3 mb-4">
                <div class="challenge-card-icon">
                  <i data-lucide="${challenge.icon}" class="h-6 w-6 text-eco-primary"></i>
                </div>
                <h3 class="challenge-card-title">${challenge.title}</h3>
              </div>
              <p class="challenge-card-description">${challenge.description}</p>
              <div class="challenge-card-stats">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Category:</span>
                  <span class="font-semibold capitalize">${challenge.category}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Points:</span>
                  <span class="font-semibold">${challenge.points}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Difficulty:</span>
                  <span class="font-semibold">${challenge.difficulty}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Participants:</span>
                  <span class="font-semibold">${challenge.participants.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button class="challenge-card-button">Join Challenge</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  lucide.createIcons();
}