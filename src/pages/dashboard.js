export function initDashboard() {
    const dashboard = document.getElementById('dashboard');
    
    const stats = [
      { icon: 'trophy', label: 'Total Points', value: '2,450' },
      { icon: 'target', label: 'Active Challenges', value: '3' },
      { icon: 'users', label: 'Community Rank', value: '#42' },
      { icon: 'tree-pine', label: 'CO₂ Saved', value: '125kg' },
    ];
  
    dashboard.innerHTML = `
      <div class="space-y-8">
        <h2 class="text-3xl font-bold text-eco-primary">Welcome Back, Eco Warrior!</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${stats.map(({ icon, label, value }) => `
            <div class="stat-card">
              <div class="flex items-center space-x-4">
                <i data-lucide="${icon}" class="h-8 w-8 text-eco-secondary"></i>
                <div>
                  <p class="text-sm text-gray-600">${label}</p>
                  <p class="text-2xl font-bold text-eco-primary">${value}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-eco-primary mb-4">Current Challenges</h3>
            <div class="space-y-4">
              <div class="border-l-4 border-eco-secondary pl-4">
                <h4 class="font-semibold">Zero Waste Week</h4>
                <p class="text-sm text-gray-600">Progress: 75%</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-eco-secondary h-2.5 rounded-full" style="width: 75%"></div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-eco-primary mb-4">Community Activity</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 rounded-full bg-eco-accent flex items-center justify-center">
                  <i data-lucide="users" class="h-4 w-4 text-eco-primary"></i>
                </div>
                <div>
                  <p class="text-sm font-semibold">Sarah completed "Plant a Tree" challenge</p>
                  <p class="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  
    lucide.createIcons();
  }