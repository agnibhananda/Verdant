export function initProfile() {
  const profile = document.getElementById('profile');
  
  const userProfile = {
    name: 'Jane Green',
    badge: 'Earth Guardian',
    points: 2450,
    joinDate: 'January 2024',
    completedChallenges: 12,
    currentStreak: 15,
  };

  const achievements = [
    { title: 'First Challenge', description: 'Complete your first eco-challenge', date: '2024-01-15' },
    { title: 'Week Warrior', description: 'Complete challenges for 7 days straight', date: '2024-02-01' },
    { title: 'Community Leader', description: 'Help 10 other members with their challenges', date: '2024-02-15' },
  ];

  profile.innerHTML = `
    <div class="space-y-8">
      <div class="profile-card">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
              alt="Profile"
              class="w-24 h-24 rounded-full object-cover"
            />
            <button class="absolute bottom-0 right-0 bg-eco-primary p-2 rounded-full text-white">
              <i data-lucide="camera" class="h-4 w-4"></i>
            </button>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-eco-primary">${userProfile.name}</h2>
            <div class="flex items-center space-x-2 mt-2">
              <i data-lucide="award" class="h-5 w-5 text-eco-secondary"></i>
              <span class="text-eco-secondary font-semibold">${userProfile.badge}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="bg-eco-background rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <i data-lucide="medal" class="h-5 w-5 text-eco-primary"></i>
              <span class="text-sm text-gray-600">Total Points</span>
            </div>
            <p class="text-2xl font-bold text-eco-primary mt-2">${userProfile.points}</p>
          </div>
          <div class="bg-eco-background rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <i data-lucide="award" class="h-5 w-5 text-eco-primary"></i>
              <span class="text-sm text-gray-600">Completed Challenges</span>
            </div>
            <p class="text-2xl font-bold text-eco-primary mt-2">${userProfile.completedChallenges}</p>
          </div>
          <div class="bg-eco-background rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <i data-lucide="calendar" class="h-5 w-5 text-eco-primary"></i>
              <span class="text-sm text-gray-600">Current Streak</span>
            </div>
            <p class="text-2xl font-bold text-eco-primary mt-2">${userProfile.currentStreak} days</p>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h3 class="text-xl font-bold text-eco-primary mb-6">Achievements</h3>
        <div class="space-y-6">
          ${achievements.map(achievement => `
            <div class="flex items-start space-x-4">
              <div class="bg-eco-accent p-2 rounded-lg">
                <i data-lucide="medal" class="h-6 w-6 text-eco-primary"></i>
              </div>
              <div>
                <h4 class="font-semibold text-eco-primary">${achievement.title}</h4>
                <p class="text-sm text-gray-600">${achievement.description}</p>
                <p class="text-xs text-gray-500 mt-1">Achieved on ${new Date(achievement.date).toLocaleDateString()}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}