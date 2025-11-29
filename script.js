// LambdaMiner Pro - Main Application Logic
class LambdaMiner {
    constructor() {
        this.userData = this.loadUserData();
        this.currentSection = 'mine';
        this.isMining = false;
        this.cooldownActive = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.checkCooldown();
    }

    // Load or initialize user data from localStorage
    loadUserData() {
        let data = localStorage.getItem('lambda_miner_data');
        if (!data) {
            // Initialize new user with unique wallet
            data = {
                walletAddress: this.generateWalletAddress(),
                minedBalance: 0,
                walletBalance: 0,
                taskRewards: 0,
                airdropRewards: 0,
                totalSessions: 0,
                lastMineTime: null,
                completedTasks: []
            };
            this.saveUserData(data);
        }
        return JSON.parse(data);
    }

    // Save user data to localStorage
    saveUserData(data) {
        localStorage.setItem('lambda_miner_data', JSON.stringify(data));
    }

    // Generate unique wallet address for each user
    generateWalletAddress() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return 'λ_' + timestamp + random.substring(0, 8);
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Mine button
        document.getElementById('mine-button').addEventListener('click', () => {
            this.startMining();
        });

        // Reset data button
        document.getElementById('reset-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all your mining data? This cannot be undone.')) {
                this.resetUserData();
            }
        });

        // Task completion buttons
        document.querySelectorAll('.task-item button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.completeTask(e.target.closest('.task-item'));
            });
        });

        // Airdrop claim buttons
        document.querySelectorAll('.airdrop-item button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.claimAirdrop(e.target.closest('.airdrop-item'));
            });
        });
    }

    // Switch between sections
    switchSection(section) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.add('hidden');
            sec.classList.remove('active');
        });

        // Show selected section
        document.getElementById(section + '-section').classList.remove('hidden');
        document.getElementById(section + '-section').classList.add('active');
        
        this.currentSection = section;
        
        // Update navigation active state
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    }

    // Start mining session
    startMining() {
        if (this.cooldownActive) {
            alert('Please wait for the cooldown period to finish before mining again.');
            return;
        }

        this.isMining = true;
        const mineButton = document.getElementById('mine-button');
        mineButton.disabled = true;
        mineButton.innerHTML = '<i data-feather="loader" class="inline w-5 h-5 mr-2 loading"></i> MINING...';
        feather.replace();

        // Simulate mining process
        setTimeout(() => {
            this.completeMining();
        }, 2000);
    }

    // Complete mining session
    completeMining() {
        const reward = 0.036;
        
        this.userData.minedBalance += reward;
        this.userData.walletBalance += reward;
        this.userData.totalSessions++;
        this.userData.lastMineTime = Date.now();
        
        this.saveUserData(this.userData);
        this.isMining = false;
        
        // Update UI
        this.updateUI();
        this.startCooldown();
        
        // Reset mine button
        const mineButton = document.getElementById('mine-button');
        mineButton.disabled = false;
        mineButton.innerHTML = '<i data-feather="zap" class="inline w-5 h-5 mr-2"></i> MINE NOW';
        feather.replace();

        // Show success notification
        this.showNotification(`Successfully mined ${reward} $λ!`, 'success');
    }

    // Start cooldown period
    startCooldown() {
        this.cooldownActive = true;
        const countdownElement = document.getElementById('countdown');
        const timerElement = document.getElementById('timer');
        
        countdownElement.classList.remove('hidden');
        
        let cooldownTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        let endTime = Date.now() + cooldownTime;
        
        const updateTimer = () => {
            const remaining = endTime - Date.now();
            
            if (remaining <= 0) {
                this.cooldownActive = false;
                countdownElement.classList.add('hidden');
                return;
            }
            
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
            requestAnimationFrame(updateTimer);
        };
        
        updateTimer();
    }

    // Check if cooldown is still active on page load
    checkCooldown() {
        if (this.userData.lastMineTime) {
            const cooldownTime = 2 * 60 * 60 * 1000;
            const timeSinceLastMine = Date.now() - this.userData.lastMineTime;
            
            if (timeSinceLastMine < cooldownTime) {
                this.startCooldown();
            }
        }
    }

    // Complete a task
    completeTask(taskElement) {
        const taskName = taskElement.querySelector('h4').textContent;
        const reward = 0.5; // Base reward, adjust based on task
        
        if (!this.userData.completedTasks.includes(taskName)) {
            this.userData.completedTasks.push(taskName);
            this.userData.taskRewards += reward;
            this.userData.walletBalance += reward;
            this.saveUserData(this.userData);
            
            // Update button state
            const button = taskElement.querySelector('button');
            button.textContent = 'COMPLETED';
            button.disabled = true;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-gray-600');
            
            this.showNotification(`Task completed! +${reward} $λ`, 'success');
            this.updateUI();
        }
    }

    // Claim airdrop reward
    claimAirdrop(airdropElement) {
        const airdropName = airdropElement.querySelector('h4').textContent;
        const reward = airdropName.includes('Weekly') ? 1.0 : 
                          airdropName.includes('Monthly') ? 5.0 : 2.0;
        
        this.userData.airdropRewards += reward;
        this.userData.walletBalance += reward;
        this.saveUserData(this.userData);
        
        // Update button state
        const button = airdropElement.querySelector('button');
        button.textContent = 'CLAIMED';
        button.disabled = true;
        button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        button.classList.add('bg-gray-600');
        
        this.showNotification(`Airdrop claimed! +${reward} $λ`, 'success');
        this.updateUI();
    }

    // Reset user data
    resetUserData() {
        const newData = {
            walletAddress: this.generateWalletAddress(),
            minedBalance: 0,
            walletBalance: 0,
            taskRewards: 0,
            airdropRewards: 0,
            totalSessions: 0,
            lastMineTime: null,
            completedTasks: []
        };
        
        this.userData = newData;
        this.saveUserData(newData);
        this.updateUI();
        this.showNotification('All data has been reset', 'info');
    }

    // Update all UI elements
    updateUI() {
        // Update balances
        document.getElementById('current-balance').textContent = this.userData.minedBalance.toFixed(3);
        document.getElementById('wallet-amount').textContent = this.userData.walletBalance.toFixed(3);
        document.getElementById('wallet-display').textContent = this.userData.walletBalance.toFixed(3);
        document.getElementById('total-sessions').textContent = this.userData.totalSessions;
        
        // Update wallet details
        document.getElementById('wallet-address').textContent = this.userData.walletAddress;
        document.getElementById('mined-display').textContent = this.userData.minedBalance.toFixed(3) + ' $λ';
        document.getElementById('task-rewards').textContent = this.userData.taskRewards.toFixed(3) + ' $λ';
        document.getElementById('airdrop-rewards').textContent = this.userData.airdropRewards.toFixed(3) + ' $λ';
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LambdaMiner();
    feather.replace();
});

// Refresh feather icons when sections change
document.addEventListener('sectionChanged', () => {
    feather.replace();
});