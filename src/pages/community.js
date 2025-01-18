export function initCommunity() {
  const community = document.getElementById('community');
  
  community.innerHTML = `
    <div class="space-y-8">
      <h2 class="text-3xl font-bold text-eco-primary">Community Hub</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="forum-card">
            <h3 class="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <i data-lucide="message-square" class="h-5 w-5 mr-2"></i>
              Discussion Forums
            </h3>
            <div class="space-y-4">
              ${['Waste Reduction', 'Energy Conservation', 'Sustainable Living']
                .map(forum => `
                  <div class="border-b last:border-0 pb-4 last:pb-0">
                    <h4 class="font-semibold text-eco-primary">${forum}</h4>
                    <p class="text-sm text-gray-600">Join the conversation about ${forum.toLowerCase()} tips and challenges.</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>24 topics</span>
                      <span>•</span>
                      <span>142 posts</span>
                    </div>
                  </div>
                `).join('')}
            </div>
          </div>

          <div class="forum-card">
            <h3 class="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <i data-lucide="share-2" class="h-5 w-5 mr-2"></i>
              Tip Marketplace
            </h3>
            <div class="space-y-4">
              ${[
                { tip: 'DIY Natural Cleaning Solutions', author: 'EcoExpert', likes: 45 },
                { tip: 'Smart Home Energy Saving Hacks', author: 'TechGreen', likes: 32 },
                { tip: 'Zero-Waste Shopping Guide', author: 'WasteFree', likes: 28 },
              ].map(item => `
                <div class="flex items-start space-x-4 border-b last:border-0 pb-4 last:pb-0">
                  <div class="flex-1">
                    <h4 class="font-semibold text-eco-primary">${item.tip}</h4>
                    <p class="text-sm text-gray-600">By ${item.author}</p>
                  </div>
                  <div class="flex items-center space-x-2 text-eco-secondary">
                    <i data-lucide="trophy" class="h-4 w-4"></i>
                    <span>${item.likes}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="forum-card">
            <h3 class="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <i data-lucide="trophy" class="h-5 w-5 mr-2"></i>
              Leaderboard
            </h3>
            <div class="space-y-4">
              ${[
                { name: 'GreenWarrior', points: 12450 },
                { name: 'EcoHero', points: 11200 },
                { name: 'PlanetSaver', points: 10800 },
              ].map((user, index) => `
                <div class="flex items-center space-x-4">
                  <span class="font-bold text-eco-primary w-6">${index + 1}</span>
                  <div class="flex-1">
                    <p class="font-semibold">${user.name}</p>
                    <p class="text-sm text-gray-600">${user.points} points</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="forum-card">
            <h3 class="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <i data-lucide="users" class="h-5 w-5 mr-2"></i>
              Active Teams
            </h3>
            <div class="space-y-4">
              ${[
                { name: 'Green Giants', members: 12 },
                { name: 'Eco Warriors', members: 8 },
                { name: 'Planet Protectors', members: 15 },
              ].map(team => `
                <div class="flex items-center justify-between">
                  <span class="font-semibold">${team.name}</span>
                  <span class="text-sm text-gray-600">${team.members} members</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}