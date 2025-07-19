// Main entry point for Chesstropia
import { GameController } from './game/GameController.js';
import { MainMenu } from './ui/MainMenu.js';
import { TeamSelector } from './ui/TeamSelector.js';
import { OptionsMenu } from './ui/OptionsMenu.js';
import { saveManager } from './utils/saveManager.js';
import { audioManager } from './utils/audioManager.js';
import { themeManager } from './utils/colorThemes.js';
import { performanceOptimizer } from './utils/performanceOptimizer.js';
import { accessibility } from './utils/accessibility.js';
import { analytics } from './utils/analytics.js';
import { errorHandler } from './utils/errorHandler.js';
import { tutorialManager } from './data/dialogue/tutorials.js';

class ChessTropiaApp {
    constructor() {
        this.currentView = null;
        this.gameController = null;
        this.container = null;
        
        // Global state
        this.state = {
            currentTeam: null,
            difficulty: 'normal',
            playerProfile: null,
            settings: this.loadSettings()
        };
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Setup container
            this.setupContainer();
            
            // Load player profile
            await this.loadPlayerProfile();
            
            // Check for saved game
            const hasActiveSave = this.checkForActiveSave();
            
            // Initialize router
            this.setupRouter();
            
            // Hide loading and show menu
            this.hideLoadingScreen();
            
            if (hasActiveSave) {
                this.showContinuePrompt();
            } else {
                this.showMainMenu();
            }
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            errorHandler.handleError({
                type: 'initialization',
                message: error.message,
                error: error
            });
        }
    }
    
    async initializeSystems() {
        // Performance optimization first
        performanceOptimizer.createParticlePool();
        
        // Apply saved settings
        this.applySettings();
        
        // Initialize audio
        audioManager.setEnabled(this.state.settings.audio);
        audioManager.setVolume(this.state.settings.volume);
        
        // Initialize themes
        themeManager.setTeamTheme('amber'); // Default theme
        
        // Initialize accessibility
        Object.entries(this.state.settings.accessibility).forEach(([key, value]) => {
            accessibility.updateSetting(key, value);
        });
        
        // Start analytics
        analytics.setPrivacyMode(this.state.settings.analytics);
        
        // Register service worker for offline support
        if ('serviceWorker' in navigator && this.state.settings.offline) {
            try {
                await navigator.serviceWorker.register('/sw.js');
            } catch (error) {
                console.log('Service worker registration failed:', error);
            }
        }
    }
    
    setupContainer() {
        this.container = document.getElementById('app');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'app';
            document.body.appendChild(this.container);
        }
        
        // Apply base styles
        this.applyBaseStyles();
        
        // Setup responsive handling
        this.setupResponsive();
    }
    
    applyBaseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: var(--bg-primary, #0F172A);
                color: var(--text-primary, #F1F5F9);
                overflow-x: hidden;
                min-height: 100vh;
            }
            
            #app {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                position: relative;
            }
            
            .view-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                animation: fade-in 0.3s ease-out;
            }
            
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .loading-content {
                text-align: center;
            }
            
            .loading-title {
                font-size: 3rem;
                font-weight: 300;
                margin-bottom: 2rem;
                background: linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: var(--accent-primary, #F59E0B);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .loading-message {
                margin-top: 2rem;
                color: var(--text-secondary, #94A3B8);
                font-style: italic;
            }
            
            .notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                animation: slide-in 0.3s ease-out;
            }
            
            @keyframes slide-in {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            .notification.info {
                background: #3B82F6;
                color: white;
            }
            
            .notification.success {
                background: #10B981;
                color: white;
            }
            
            .notification.warning {
                background: #F59E0B;
                color: white;
            }
            
            .notification.error {
                background: #EF4444;
                color: white;
            }
            
            .notification.breakthrough {
                background: linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6);
                color: white;
                font-weight: bold;
            }
            
            .button {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .button:active {
                transform: translateY(0);
            }
            
            .button-primary {
                background: var(--accent-primary, #F59E0B);
                color: white;
            }
            
            .button-secondary {
                background: var(--bg-secondary, #1E293B);
                color: var(--text-primary);
                border: 1px solid var(--border-color, #334155);
            }
            
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                animation: fade-in 0.2s ease-out;
            }
            
            .modal {
                background: var(--bg-secondary, #1E293B);
                border-radius: 1rem;
                padding: 2rem;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                animation: modal-enter 0.3s ease-out;
            }
            
            @keyframes modal-enter {
                from { 
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .loading-title {
                    font-size: 2rem;
                }
                
                .notification {
                    left: 1rem;
                    right: 1rem;
                    bottom: 1rem;
                }
                
                .modal {
                    padding: 1rem;
                    margin: 1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupResponsive() {
        const updateViewport = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        updateViewport();
        window.addEventListener('resize', updateViewport);
        window.addEventListener('orientationchange', updateViewport);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('chesstropia_settings');
        const defaults = {
            audio: true,
            volume: 0.5,
            difficulty: 'normal',
            theme: 'auto',
            particles: true,
            analytics: true,
            offline: true,
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                largeText: false,
                screenReader: true
            }
        };
        
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }
    
    applySettings() {
        // Apply theme
        if (this.state.settings.theme === 'dark' || 
            (this.state.settings.theme === 'auto' && 
             window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-theme');
        }
        
        // Apply performance settings
        if (!this.state.settings.particles) {
            performanceOptimizer.setUserPreference('performance', 'low');
        }
    }
    
    async loadPlayerProfile() {
        const profile = localStorage.getItem('chesstropia_profile');
        
        if (profile) {
            this.state.playerProfile = JSON.parse(profile);
        } else {
            // First time player
            this.state.playerProfile = {
                id: this.generatePlayerId(),
                createdAt: Date.now(),
                tutorialsViewed: [],
                preferences: {},
                achievements: [],
                statistics: saveManager.statistics
            };
            
            this.savePlayerProfile();
        }
    }
    
    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    savePlayerProfile() {
        localStorage.setItem('chesstropia_profile', JSON.stringify(this.state.playerProfile));
    }
    
    checkForActiveSave() {
        const autoSave = localStorage.getItem('chesstropia_save_auto');
        if (autoSave) {
            try {
                const save = JSON.parse(autoSave);
                const hoursSinceLastSave = (Date.now() - save.timestamp) / (1000 * 60 * 60);
                return hoursSinceLastSave < 24; // Active if saved within 24 hours
            } catch {
                return false;
            }
        }
        return false;
    }
    
    setupRouter() {
        // Simple hash-based routing
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
        
        // Handle back button
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'menu';
        const [route, ...params] = hash.split('/');
        
        switch (route) {
            case 'menu':
                this.showMainMenu();
                break;
                
            case 'play':
                this.showTeamSelector();
                break;
                
            case 'game':
                if (params[0]) {
                    this.startGame(params[0], params[1] || 'normal');
                }
                break;
                
            case 'continue':
                this.continueGame();
                break;
                
            case 'options':
                this.showOptions();
                break;
                
            case 'achievements':
                this.showAchievements();
                break;
                
            case 'about':
                this.showAbout();
                break;
                
            default:
                this.showMainMenu();
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <h1 class="loading-title">ChessTropia</h1>
                <div class="loading-spinner"></div>
                <p class="loading-message">Preparing emotional journeys...</p>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Rotate loading messages
        const messages = [
            "Preparing emotional journeys...",
            "Gathering the pieces...",
            "Opening hearts...",
            "Building trust...",
            "Creating safe spaces..."
        ];
        
        let messageIndex = 0;
        this.loadingInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            const messageElement = loadingScreen.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = messages[messageIndex];
            }
        }, 2000);
    }
    
    hideLoadingScreen() {
        clearInterval(this.loadingInterval);
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 300);
        }
    }
    
    showContinuePrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'modal-backdrop';
        prompt.innerHTML = `
            <div class="modal">
                <h2>Continue Your Journey?</h2>
                <p>You have an active game in progress.</p>
                <div class="modal-actions" style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="button button-primary" onclick="app.continueGame()">
                        Continue
                    </button>
                    <button class="button button-secondary" onclick="app.showMainMenu()">
                        New Game
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
    }
    
    clearView() {
        if (this.currentView) {
            this.currentView.destroy?.();
            this.currentView = null;
        }
        
        this.container.innerHTML = '';
        
        // Clean up any modals
        document.querySelectorAll('.modal-backdrop').forEach(modal => modal.remove());
    }
    
    showMainMenu() {
        this.clearView();
        window.location.hash = 'menu';
        
        const menuContainer = document.createElement('div');
        menuContainer.className = 'view-container';
        this.container.appendChild(menuContainer);
        
        this.currentView = new MainMenu(menuContainer, {
            onPlay: () => this.showTeamSelector(),
            onContinue: () => this.continueGame(),
            onOptions: () => this.showOptions(),
            onAchievements: () => this.showAchievements(),
            onAbout: () => this.showAbout(),
            profile: this.state.playerProfile
        });
    }
    
    showTeamSelector() {
        this.clearView();
        window.location.hash = 'play';
        
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'view-container';
        this.container.appendChild(selectorContainer);
        
        this.currentView = new TeamSelector(selectorContainer, {
            onSelect: (teamId, difficulty) => {
                this.startGame(teamId, difficulty);
            },
            onBack: () => this.showMainMenu(),
            unlockedTeams: saveManager.teamUnlockTracker.getAvailableTeams()
        });
    }
    
    async startGame(teamId, difficulty = 'normal') {
        this.clearView();
        window.location.hash = `game/${teamId}/${difficulty}`;
        
        // Show loading
        this.showGameLoading();
        
        try {
            const gameContainer = document.createElement('div');
            gameContainer.className = 'view-container game-view';
            this.container.appendChild(gameContainer);
            
            // Check for tutorial
            if (tutorialManager.shouldShowTutorial('first_game')) {
                await this.showFirstGameTutorial();
            }
            
            // Create game
            this.gameController = new GameController({
                container: gameContainer,
                team: teamId,
                difficulty: difficulty,
                mode: 'campaign'
            });
            
            // Listen for game events
            this.gameController.on('gameEnded', (result) => {
                this.handleGameEnd(result);
            });
            
            // Track game start
            analytics.trackEvent('game_started', 'game', {
                team: teamId,
                difficulty: difficulty
            });
            
            this.hideGameLoading();
            
        } catch (error) {
            console.error('Failed to start game:', error);
            this.showError('Failed to start game. Please try again.');
            this.showMainMenu();
        }
    }
    
    async continueGame() {
        const saveResult = saveManager.load('auto');
        
        if (saveResult.success) {
            const { gameState } = saveResult;
            const { team, difficulty } = gameState.metadata;
            
            // Start game with saved state
            await this.startGame(team, difficulty);
            
            // Restore game state
            if (this.gameController) {
                this.gameController.restoreState(gameState);
                this.showNotification('Game restored!', 'success');
            }
        } else {
            this.showError('Failed to load saved game');
            this.showMainMenu();
        }
    }
    
    showOptions() {
        this.clearView();
        window.location.hash = 'options';
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'view-container';
        this.container.appendChild(optionsContainer);
        
        this.currentView = new OptionsMenu(optionsContainer, {
            settings: this.state.settings,
            onSave: (newSettings) => {
                this.state.settings = newSettings;
                localStorage.setItem('chesstropia_settings', JSON.stringify(newSettings));
                this.applySettings();
                this.showNotification('Settings saved!', 'success');
            },
            onBack: () => this.showMainMenu()
        });
    }
    
    showAchievements() {
        this.clearView();
        window.location.hash = 'achievements';
        
        const achievementsContainer = document.createElement('div');
        achievementsContainer.className = 'view-container';
        this.container.appendChild(achievementsContainer);
        
        // Create achievements view
        const achievements = saveManager.achievements;
        const progress = saveManager.getOverallProgress();
        
        achievementsContainer.innerHTML = `
            <div class="achievements-view">
                <h1>Your Journey</h1>
                
                <div class="progress-summary">
                    <div class="progress-item">
                        <span class="label">Overall Progress</span>
                        <span class="value">${Math.round(progress.overallCompletion * 100)}%</span>
                    </div>
                    <div class="progress-item">
                        <span class="label">Pieces Healed</span>
                        <span class="value">${progress.totalHealed}</span>
                    </div>
                    <div class="progress-item">
                        <span class="label">Empathy Level</span>
                        <span class="value">${progress.empathyLevel}/10</span>
                    </div>
                </div>
                
                <div class="achievements-grid">
                    ${Object.values(achievements).map(achievement => `
                        <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
                            <h3>${achievement.name}</h3>
                            <p>${achievement.description}</p>
                            ${achievement.unlocked ? 
                                `<span class="unlock-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</span>` : 
                                '<span class="locked-text">Not yet achieved</span>'
                            }
                        </div>
                    `).join('')}
                </div>
                
                <button class="button button-secondary" onclick="app.showMainMenu()">
                    Back to Menu
                </button>
            </div>
        `;
    }
    
    showAbout() {
        this.clearView();
        window.location.hash = 'about';
        
        const aboutContainer = document.createElement('div');
        aboutContainer.className = 'view-container';
        this.container.appendChild(aboutContainer);
        
        aboutContainer.innerHTML = `
            <div class="about-view">
                <h1>About ChessTropia</h1>
                
                <div class="about-content">
                    <p>
                        ChessTropia is more than a game - it's an exploration of emotional intelligence,
                        empathy, and the complexities of human connection through the familiar framework
                        of checkers.
                    </p>
                    
                    <h2>The Journey</h2>
                    <p>
                        Each piece represents a person with their own traumas, fears, and hopes.
                        Your role isn't just to win - it's to understand, support, and guide them
                        through their emotional journeys.
                    </p>
                    
                    <h2>What You'll Learn</h2>
                    <ul>
                        <li>How to recognize different emotional states</li>
                        <li>Appropriate responses to various forms of distress</li>
                        <li>The importance of consistency in building trust</li>
                        <li>How trauma affects behavior and relationships</li>
                        <li>That healing isn't linear</li>
                    </ul>
                    
                    <h2>Credits</h2>
                    <p>
                        Created with love by developers who believe games can teach empathy.
                        Special thanks to everyone who has shared their emotional journeys and
                        helped make this game more authentic.
                    </p>
                    
                    <h2>Resources</h2>
                    <p>
                        If this game brings up difficult emotions, please reach out for support:
                    </p>
                    <ul>
                        <li>Crisis Text Line: Text HOME to 741741</li>
                        <li>SAMHSA National Helpline: 1-800-662-4357</li>
                        <li>Your local mental health resources</li>
                    </ul>
                </div>
                
                <button class="button button-secondary" onclick="app.showMainMenu()">
                    Back to Menu
                </button>
            </div>
        `;
    }
    
    showGameLoading() {
        const loader = document.createElement('div');
        loader.className = 'game-loading';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Gathering your pieces...</p>
        `;
        
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        `;
        
        this.container.appendChild(loader);
    }
    
    hideGameLoading() {
        const loader = this.container.querySelector('.game-loading');
        if (loader) loader.remove();
    }
    
    async showFirstGameTutorial() {
        return new Promise(resolve => {
            const tutorial = tutorialManager.startTutorial('firstTimePlayer', 'welcome');
            
            const showNextMessage = () => {
                const message = tutorialManager.advance();
                if (message) {
                    this.showTutorialMessage(message, showNextMessage);
                } else {
                    tutorialManager.markViewed('first_game');
                    resolve();
                }
            };
            
            this.showTutorialMessage(tutorial, showNextMessage);
        });
    }
    
    showTutorialMessage(message, onNext) {
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.className = 'tutorial-overlay';
        tutorialOverlay.innerHTML = `
            <div class="tutorial-message">
                <p>${message.text}</p>
                <button class="button button-primary" onclick="this.parentElement.parentElement.remove(); (${onNext})()">
                    Continue
                </button>
            </div>
        `;
        
        tutorialOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        document.body.appendChild(tutorialOverlay);
        
        // Auto-advance if specified
        if (message.pause) {
            setTimeout(() => {
                tutorialOverlay.remove();
                onNext();
            }, message.pause);
        }
    }
    
    handleGameEnd(result) {
        // Update statistics
        saveManager.teamUnlockTracker.checkUnlockConditions(saveManager.statistics.global);
        
        // Show results with slight delay
        setTimeout(() => {
            if (result.result === 'victory') {
                audioManager.play('victory');
            } else {
                audioManager.play('defeat');
            }
            
            // Check for new unlocks
            const newUnlocks = saveManager.teamUnlockTracker.getAvailableTeams()
                .filter(team => !this.state.playerProfile.unlockedTeams?.includes(team.id));
            
            if (newUnlocks.length > 0) {
                setTimeout(() => {
                    this.showUnlockNotification(newUnlocks[0]);
                }, 3000);
            }
        }, 1000);
    }
    
    showUnlockNotification(team) {
        const notification = document.createElement('div');
        notification.className = 'unlock-notification modal-backdrop';
        notification.innerHTML = `
            <div class="modal unlock-modal">
                <h2>New Team Unlocked!</h2>
                <div class="unlock-content">
                    <div class="team-icon">${team.icon}</div>
                    <h3>${team.name}</h3>
                    <p>${team.description}</p>
                    <p class="unlock-reason">Unlocked by: ${team.unlockCondition}</p>
                </div>
                <button class="button button-primary" onclick="this.parentElement.parentElement.remove()">
                    Wonderful!
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        audioManager.play('achievement');
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slide-out 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }
    
    showError(message) {
        this.showNotification(message, 'error', 5000);
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    window.app = new ChessTropiaApp();
});

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Show user-friendly error
    if (window.app) {
        window.app.showError('Something went wrong. The error has been logged.');
    }
});

// Handle promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.app) {
        window.app.showError('An unexpected error occurred.');
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (event) => {
    if (window.app?.gameController?.state?.phase === 'playing') {
        event.preventDefault();
        event.returnValue = 'You have an active game. Are you sure you want to leave?';
    }
});

// Export for debugging
window.ChessTropia = {
    version: '1.0.0',
    debug: {
        enableDebugMode: () => errorHandler.enableDebugMode(),
        showStats: () => console.log(saveManager.statistics),
        unlockAllTeams: () => {
            Object.keys(teamRegistry).forEach(teamId => {
                saveManager.teamUnlockTracker.unlockTeam(teamId);
            });
            console.log('All teams unlocked!');
        },
        resetProgress: () => {
            if (confirm('This will delete all progress. Are you sure?')) {
                localStorage.clear();
                location.reload();
            }
        }
    }
};